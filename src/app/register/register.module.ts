import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RegisterComponent } from './register.component';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterService } from './register.service';
import { FormRegisterComponent } from './form/form.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // RouterModule.forChild([{ path: '', component: RegisterComponent }]),
    RegisterRoutingModule,
  ],
  declarations: [RegisterComponent, FormRegisterComponent],
  providers: [RegisterService],

})
export class RegisterModule { }
