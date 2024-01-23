import { AfterViewInit, Component, ElementRef, Injector, OnChanges, SimpleChanges, ViewChild, effect, inject, runInInjectionContext } from '@angular/core';
import mapboxgl, { LngLat, Map, Marker } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { environment } from '../../../../environments/environment';
import { FieldService } from '../../../services/field/field.service';
import { Field } from '../../../interfaces/field';

mapboxgl.accessToken = environment.mapbox_api_key;


@Component({
  selector: 'app-map-list',
  standalone: true,
  imports: [],
  templateUrl: './map-list.component.html',
  styleUrl: './map-list.component.scss'
})
export class MapListComponent implements AfterViewInit {

  @ViewChild('mapListDiv')
  mapDivElement!: ElementRef;

  constructor(private fieldService: FieldService) {
    fieldService.setFieldSignalByType(null);
  }

  public map?: Map;
  public fields = this.fieldService.fields;

  injector = inject(Injector);

  ngOnInit(): void {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        this.addMarkersToMap();
      });
    });
  }

  ngAfterViewInit(): void {

    if (!this.mapDivElement) throw 'HTML map element not found';

    this.map = new mapboxgl.Map({
      container: this.mapDivElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [2.15899, 41.38879],
      zoom: 11,
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('load', () => {
      this.map!.removeLayer('poi-label');
      this.map!.removeLayer('settlement-major-label');
      this.map!.removeLayer('settlement-minor-label');
    });

  }

  addMarkersToMap(): void {
    this.fields().forEach(field => {
      const coordinates: LngLat = new LngLat(field.location_lng, field.location_lat);
      new Marker({
        color: 'green'
      }).setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(this.getPopupHtml(field)))
        .addTo(this.map!);
    });
  }

  getPopupHtml(field: Field): string {
    return `<h5 class="mt-2 text-center">${field.name}</h5><br><p>${field.address}</p><br><span class="rounded-pill px-3 bg-secondary field-type">${field.type}</span>`;
  }
}
