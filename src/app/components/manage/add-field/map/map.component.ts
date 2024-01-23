import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core';
import mapboxgl, { LngLat } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { environment } from '../../../../../environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

mapboxgl.accessToken = environment.mapbox_api_key;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit {

  activeModal = inject(NgbActiveModal);

  @ViewChild('mapDiv')
  mapDivElement!: ElementRef;

  public latLang!: LngLat;

  ngAfterViewInit(): void {
    const map = new mapboxgl.Map({
      container: this.mapDivElement.nativeElement,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [2.15899, 41.38879],
      zoom: 11,
    });

    map.addControl(new mapboxgl.NavigationControl());

    let marker = new mapboxgl.Marker({
      color: '#2e7d32',
      draggable: true
    });

    map.on('click', (event) => {
      this.latLang = event.lngLat;
      marker.setLngLat(this.latLang).addTo(map);
    });
  }

  closeMap() {
    this.activeModal.close({
      coordinates: this.latLang
    });
  }
}
