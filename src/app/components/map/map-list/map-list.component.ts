import { AfterViewInit, Component, ElementRef, Injector, ViewChild, effect, inject, runInInjectionContext } from '@angular/core';
import mapboxgl, { LngLat, Map, Marker } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { environment } from '../../../../environments/environment';
import { FieldService } from '../../../services/field/field.service';
import { Field } from '../../../interfaces/field';
import { Router, RouterLink } from '@angular/router';

mapboxgl.accessToken = environment.mapbox_api_key;

@Component({
  selector: 'app-map-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './map-list.component.html',
  styleUrl: './map-list.component.scss'
})
export class MapListComponent implements AfterViewInit {

  @ViewChild('mapListDiv')
  mapDivElement!: ElementRef;

  @ViewChild("popupContainer") popupContainer!: ElementRef;
  fieldPopup?: Field;

  public bcnCoordinates: LngLat = new LngLat(2.15899, 41.38879);


  constructor(private fieldService: FieldService, private router: Router) {
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
      center: this.bcnCoordinates,
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

      const popupContent = this.getPopupHtml(field);

      let popup = new mapboxgl.Popup({}).setDOMContent(popupContent);

      const marker = new Marker({
        color: 'green'
      }).setLngLat(coordinates)
        .setPopup(popup)
        .addTo(this.map!);

      marker.getElement().addEventListener('click', () => {
        this.flyToMarker(marker);
        this.fieldPopup = field;
      })
    });
  }

  flyToMarker(marker: Marker) {
    this.map?.flyTo({
      zoom: 15,
      center: marker.getLngLat()
    })
  }

  centerMap() {
    this.map?.flyTo({
      zoom: 11,
      center: this.bcnCoordinates
    })
  }

  getPopupHtml(field: Field) {

    let action = field.public ? 'View' : 'Book';

    const actionButton = document.createElement('div');
    actionButton.innerHTML = `<button class="btn ${field.public ? 'btn-danger' : 'btn-primary' } w-100 mt-2">${action}</button>`;

    actionButton.addEventListener('click', () => {
      this.router.navigate([`/fields/${field.id}`]);
    });

    const div = document.createElement('div');

    let publicField = ''
    if (field.public) publicField = '<span class="rounded-pill px-3 bg-danger-subtle field-type">Public</span>';

    const content = document.createElement('div');
    content.classList.add('d-flex', 'flex-column', 'gap-2', 'text-center')
    content.innerHTML = `
      <h5 class="text-center">${field.name}</h5>
      <p>${field.address}</p>
      <div class="d-flex justify-content-between">
        <span class="rounded-pill px-3 bg-secondary field-type">${field.type}</span>` +
        publicField +
      `</div>`;

    content.appendChild(actionButton);
    div.appendChild(content);

    return div;
  }
}
