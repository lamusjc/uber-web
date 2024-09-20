import { Injectable } from "@angular/core";
import { ServiceService } from 'src/services/service.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ProductsService {

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
    getProducts() {
        return this.serviceService.get('products');
    }

    getPlace() {
        return this.serviceService.get('place');
    }

    createProducts(data) {
        return this.serviceService.post('products', data);
    }

    updateProducts(data) {
        return this.serviceService.put('products', data);
    }

    deleteProducts(data) {
        return this.serviceService.delete('products/' + data);
    }

}