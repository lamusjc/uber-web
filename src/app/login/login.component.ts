import { Component } from '@angular/core';
import { LoadingService } from 'src/services/loading.service';


@Component({
  selector: 'login-component',
  templateUrl: 'login.html',
  styleUrls: ['login.scss']
})
export class LoginComponent {


  constructor(public loadingService: LoadingService,) {

  }


}
