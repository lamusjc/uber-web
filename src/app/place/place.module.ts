import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlaceRoutingModule } from './place-routing.module';
import { PlaceComponent } from './place.component';
import { PlaceService } from './place.service';
import { ToolbarComponent } from '../toolbar/toolbar';
import { CreatePlaceComponent } from './create_place/create_place';
import { GetPlaceComponent } from './get_place/get_place';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // RouterModule.forChild([{ path: '', component: RegisterComponent }]),
    PlaceRoutingModule,
  ],
  declarations: [PlaceComponent, CreatePlaceComponent, GetPlaceComponent, ToolbarComponent],
  providers: [PlaceService]
})
export class PlaceModule { }
