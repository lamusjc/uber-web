import { Component } from '@angular/core';

import { Platform, MenuController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoginService } from './login/login.service';
import { LoadingService } from 'src/services/loading.service';
import { HomeService } from './home/home.service';
import { Router } from '@angular/router';
import { UrlService } from 'src/services/url.service';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  values: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private loadingService: LoadingService,
    private menu: MenuController,
    private loginService: LoginService,
    private alertController: AlertController,
    private router: Router,
    private homeService: HomeService,
    public urlService: UrlService,
    private appService: AppService
  ) {
    this.initializeApp();

  }

  initializeApp() {
    this.values = this.urlService.getValues();
    this.appService.subscribe((res: any) => {
      if (res == 'render_values') {
        this.values = this.urlService.getValues();
      }
    });
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

  }


  logout() {
    this.loadingService.present();
    this.homeService.logout().subscribe((res: any) => {
      this.loadingService.dismiss();
      localStorage.removeItem('_t');
      this.loginService.isAuthenticated = false;
      this.urlService.clearValues();
      this.appService.renderAgain('render_values');
      this.router.navigate(['/login']);
    }, err => {
      this.loadingService.dismiss();
      localStorage.removeItem('_t');
      this.urlService.clearValues();
      this.appService.renderAgain('render_values');
      this.alertController.create({
        header: `Error ${err.error.status}`,
        message: `<b> ${err.error.message} </b>`,
        buttons: [{
          text: 'OK'
        }]
      }).then(alert => alert.present());
      this.router.navigate(['/login']);
    });
  }
}
