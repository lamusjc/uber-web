import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlService } from './url.service';
import { Storage } from '@ionic/storage';


@Injectable({
    providedIn: 'root'
})

export class ServiceService {

    constructor(private HttpClient: HttpClient, private UrlService: UrlService, private storage: Storage) { }
    get(endpoint): Observable<any> {
        const token = localStorage.getItem('_t') || "";
        const headers = {
            headers: new HttpHeaders({
                'Content-Type': "application/json",
                'Authorization': token
            }),
            withCredentials: true
        };

        return this.HttpClient.get(this.UrlService.getUrl() + endpoint, headers);
    }

    post(endpoint, data) {
        const token = localStorage.getItem('_t') || "";

        const headers = {
            headers: new HttpHeaders({
                'Content-Type': "application/json",
                'Authorization': token
            }),
            withCredentials: true
        };

        return this.HttpClient.post(this.UrlService.getUrl() + endpoint, data, headers);
    }


    put(endpoint, data?): Observable<any> {
        const token = localStorage.getItem('_t') || "";
        const headers = {
            headers: new HttpHeaders({
                'Content-Type': "application/json",
                'Authorization': token
            }),
            withCredentials: true
        };

        return this.HttpClient.put(this.UrlService.getUrl() + endpoint, data, headers);
    }

    delete(endpoint): Observable<any> {
        const token = localStorage.getItem('_t') || "";
        const headers = {
            headers: new HttpHeaders({
                'Content-Type': "application/json",
                'Authorization': token
            }),
            withCredentials: true
        };

        return this.HttpClient.delete(this.UrlService.getUrl() + endpoint, headers);
    }

    getValues() {
        return this.UrlService.getValues();
    }

}