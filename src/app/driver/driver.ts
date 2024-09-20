import { Component } from '@angular/core';
import _ from 'lodash';
import { DriverService } from './driver.service';

@Component({
  selector: 'app-driver',
  templateUrl: 'driver.html',
  styleUrls: ['driver.scss']
})
export class DriverComponent {
  constructor(private driverService: DriverService) {
  }

  ionViewWillEnter() {
    this.driverService.renderAgain('get_driver');
  }
}