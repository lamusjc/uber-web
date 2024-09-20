import { Component } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UrlService } from 'src/services/url.service';
import { LoadingService } from 'src/services/loading.service';
import { Storage } from '@ionic/storage';
import { AppService } from 'src/app/app.service';
import { LoginService } from '../login.service';

@Component({
  selector: 'form-login-component',
  templateUrl: 'form.html',
  styleUrls: ['form.scss']
})
export class FormLoginComponent {
  form: FormGroup;

  constructor(public loadingService: LoadingService, private storage: Storage, private url: UrlService, private app: AppService, private alertController: AlertController, private formBuilder: FormBuilder, private loginService: LoginService, private router: Router) {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  processForm(event) {
    event.preventDefault();
    this.loadingService.present();

    this.loginService.loginUser(this.form.value).subscribe(async (res: any) => {
      this.loadingService.dismiss();
      this.loginService.isAuthenticated = true;
      this.url.setValues(res.data.username, res.data.users_id, res.data.role_id, res.data.role_name);
      this.app.renderAgain('render_values');
      localStorage.setItem('_t', res.data.token);
      this.router.navigate(['/home']);

    }, (err) => {
      this.loadingService.dismiss();
      this.alertController.create({
        header: `Error ${err.error.status}`,
        message: `<b> ${err.error.message} </b>`,
        buttons: [{
          text: 'OK'
        }]
      }).then(alert => alert.present());

    });

  }

}
