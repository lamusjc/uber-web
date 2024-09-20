import { Component } from '@angular/core';
import { PlaceService } from './place.service';

@Component({
  selector: 'place-component',
  templateUrl: 'place.html',
  styleUrls: ['place.scss']
})
export class PlaceComponent {
  constructor(private placeService: PlaceService) { }

  ionViewWillEnter() {
    this.placeService.renderAgain('get_map');
    this.placeService.renderAgain('get_place');
  }

}