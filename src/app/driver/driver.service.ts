import { Injectable } from "@angular/core";
import { ServiceService } from 'src/services/service.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class DriverService {

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

    updateDriver(data) {
        return this.serviceService.put('driver', data);
    }

    getValues() {
        return this.serviceService.getValues();
    }

    getDriver(){
        return this.serviceService.get('driver');
    }



}