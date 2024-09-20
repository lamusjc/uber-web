import { Injectable } from "@angular/core";
import { ServiceService } from 'src/services/service.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class HomeService {

    private Subject: Subject<any>;

    constructor(private serviceService: ServiceService) {
        this.Subject = new Subject();
    }

    subscribe(next, error?, complete?) {
        return this.Subject.subscribe(next, error, complete);
    }

    renderAgain(res) {
        this.Subject.next(res);
    }


    getPlace() {
        return this.serviceService.get('place');
    }

    getValues() {
        return this.serviceService.getValues();
    }

    logout() {
        return this.serviceService.get('logout');
    }

}