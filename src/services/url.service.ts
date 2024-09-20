import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class UrlService {
    url: any;
    username: any = '';
    users_id: any = '';
    role_id: any = '';
    role_name: any = '';

    constructor() {
        this.url = 'https://uberapi-lamus.herokuapp.com/';
        // this.url = 'http://192.168.0.110:3000/';
    }


    getUrl() {
        return this.url;
    }

    setValues(username, users_id, role_id, role_name) {
        this.username = username;
        this.users_id = users_id;
        this.role_id = role_id;
        this.role_name = role_name;
    }

    getValues() {
        return {
            username: this.username,
            users_id: this.users_id,
            role_id: this.role_id,
            role_name: this.role_name
        };
    }

    clearValues() {
        this.username = '';
        this.users_id = '';
        this.role_id = '';
        this.role_name = '';
    }

}