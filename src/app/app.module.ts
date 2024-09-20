import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceService } from 'src/services/service.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AuthGuard } from './guards/auth.guard';
import { SessionInterceptor } from './guards/session.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AppService } from './app.service';
import { IonicStorageModule } from '@ionic/storage';
import { GoogleMaps } from '@ionic-native/google-maps';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { ToolbarComponent } from './toolbar/toolbar';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: 'https://uberapi-lamus.herokuapp.com/', options: {} };


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), SocketIoModule.forRoot(config), IonicStorageModule.forRoot(), AppRoutingModule, FormsModule, ReactiveFormsModule, HttpClientModule, BrowserAnimationsModule, FlexLayoutModule],
  providers: [
    StatusBar,
    SplashScreen,
    ServiceService,
    Camera,
    File,
    WebView,
    FilePath,
    NativeStorage,
    LocalNotifications,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SessionInterceptor,
      multi: true
    },
    AppService,
    GoogleMaps,
    DocumentViewer,
    FileTransfer

  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
