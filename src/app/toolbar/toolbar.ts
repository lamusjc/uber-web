import { Component, Input, OnInit } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import _ from 'lodash';

import { UrlService } from 'src/services/url.service';

@Component({
    selector: 'toolbar-component',
    templateUrl: 'toolbar.html',
    styleUrls: ['toolbar.scss']
})
export class ToolbarComponent implements OnInit {
    @Input() name: string;
    constructor(public urlService: UrlService, public route: ActivatedRoute, public toastController: ToastController, private menu: MenuController) {

    }

    ngOnInit() {
        this.menu.enable(true, 'first');
    }

    async openMenu() {
        await this.menu.open();
    }

}