import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DriverComponent } from './driver';
import { DriverService } from './driver.service';
import { DriverRoutingModule } from './driver-routing.module';
import { ToolbarComponent } from '../toolbar/toolbar';
import { FormDriverComponent } from './form_driver/form_driver';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // RouterModule.forChild([{ path: '', component: HomePage }]),
    DriverRoutingModule,
    FlexLayoutModule,
    DragDropModule
  ],
  declarations: [DriverComponent, FormDriverComponent, ToolbarComponent],
  providers: [DriverService]
})
export class DriverModule { }
