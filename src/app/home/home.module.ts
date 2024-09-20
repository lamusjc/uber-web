import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { RouterModule } from '@angular/router';
import { HomeService } from './home.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ToolbarComponent } from '../toolbar/toolbar';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // RouterModule.forChild([{ path: '', component: HomePage }]),
    HomePageRoutingModule,
    FlexLayoutModule,
    DragDropModule
  ],
  declarations: [HomePage, ToolbarComponent],
  providers: [HomeService],
})
export class HomePageModule { }
