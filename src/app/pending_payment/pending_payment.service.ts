import { Injectable } from "@angular/core";
import { ServiceService } from 'src/services/service.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class PendingPaymentService {

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

    getPayment() {
        return this.serviceService.get('pending_orders');
    }

    getValues() {
        return this.serviceService.getValues();
    }

}