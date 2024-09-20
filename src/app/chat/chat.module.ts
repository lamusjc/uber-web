import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { ToolbarComponent } from '../toolbar/toolbar';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat';
import { ChatService } from './chat.service';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // RouterModule.forChild([{ path: '', component: HomePage }]),
    ChatRoutingModule,
    FlexLayoutModule,
    DragDropModule
  ],
  declarations: [ChatComponent, ToolbarComponent],
  providers: [ChatService]
})
export class ChatModule { }
