import { Injectable } from "@angular/core";
import { ServiceService } from 'src/services/service.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class PlaceService {
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
    registerUser(data) {
        return this.serviceService.post('register', data);
    }

    getPlace() {
        return this.serviceService.get('place');
    }

    createPlace(data) {
        return this.serviceService.post('place', data);
    }

    updatePlace(data) {
        return this.serviceService.put('place', data);
    }

    deletePlace(data) {
        return this.serviceService.delete('place/' + data);
    }

}