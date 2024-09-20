import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from '../login/login.service';
import { UrlService } from 'src/services/url.service';
import { map } from 'rxjs/operators';
import { AppService } from '../app.service';
import { Storage } from '@ionic/storage';

@Injectable()
export class AuthGuard implements CanActivate {

    /**
     * Constructor
     *
     * @param {FuseConfigService} fuseConfigService
     * @param {FormBuilder} formBuilder
     */
    constructor(private router: Router, private urlService: UrlService, private storage: Storage, private appService: AppService, private HttpClient: HttpClient, public loginService: LoginService) { }

    canActivate(): Observable<boolean> | boolean {
        const token = localStorage.getItem('_t') || "";
        const headers = {
            headers: new HttpHeaders({
                'Content-Type': "application/json",
                'Authorization': token
            }), withCredentials: true
        };
        if ((this.loginService.isAuthenticated === false)) {
            return this.HttpClient.get(this.urlService.getUrl() + 'info', headers).pipe(map((res: any) => {
                this.urlService.setValues(res.data.username, res.data.users_id, res.data.role_id, res.data.role_name);
                this.appService.renderAgain('render_values');
                console.log('auth.guard');
                return true;
            }, (err) => {
                this.router.navigate(['login']);
                return false;
            }));
        } else if (this.loginService.isAuthenticated === true) {
            return true;
        } else {
            this.router.navigate(['login']);
            return false;
        }
    }
}