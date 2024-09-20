import { Injectable } from "@angular/core";
import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs";
import * as moment from 'moment';

@Injectable({
    providedIn: "root"
})

export class AppService {
    private Subject: Subject<any>;

    constructor() {
        this.Subject = new Subject();
    }

    subscribe(next, error?, complete?) {
        return this.Subject.subscribe(next, error, complete);
    }

    renderAgain(res) {
        this.Subject.next(res);
    }
}