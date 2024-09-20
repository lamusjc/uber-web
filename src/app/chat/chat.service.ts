import { Injectable } from "@angular/core";
import { ServiceService } from 'src/services/service.service';
import { Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';

@Injectable({
    providedIn: 'root'
})

export class ChatService {

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

    getChat(bill_id, buyer, driver) {
        return this.serviceService.get('chat/' + bill_id + '/' + buyer + '/' + driver);
    }


    getValues() {
        return this.serviceService.getValues();
    }

    getUsersId(users_id) {
        return this.serviceService.get('getuser/' + users_id);
    }


    finish(data) {
        return this.serviceService.put('payment', data);
    }

}