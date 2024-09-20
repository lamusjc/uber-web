import { Injectable } from "@angular/core";
import { ServiceService } from 'src/services/service.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class CartService {

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


    getCart() {
        return this.serviceService.get('cart');
    }

    deleteCart(data) {
        return this.serviceService.delete('cart/' + data);
    }

    getValues() {
        return this.serviceService.getValues();
    }

    addPayment(data){
        return this.serviceService.post('payment', data);
    }

}