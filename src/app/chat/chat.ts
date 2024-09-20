import { Component, ViewChild } from '@angular/core';
import _ from 'lodash';
import { ChatService } from './chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { AlertController } from '@ionic/angular';
import { LoadingService } from 'src/services/loading.service';

@Component({
  selector: 'app-chat',
  templateUrl: 'chat.html',
  styleUrls: ['chat.scss']
})
export class ChatComponent {
  chat: any = [];
  values: any;
  message = '';
  messages = [];
  currentUser = "";
  currentId = '';
  dataUser: any = {
    show: false
  };
  bill_id = this.route.snapshot.paramMap.get('bill_id');
  buyer = this.route.snapshot.paramMap.get('buyer');
  driver = this.route.snapshot.paramMap.get('driver');
  @ViewChild('content') private content: any;

  constructor(private chatService: ChatService, private router: Router, private loadingService: LoadingService, private alertController: AlertController, private route: ActivatedRoute, private socket: Socket) {

  
  }

  scrollToBottomOnInit() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom(400);
      }
    }, 500);
  }


  ionViewWillEnter() {
    this.values = this.chatService.getValues();
    this.currentId = this.values.users_id;
    this.chatService.renderAgain('get_chat');
    this.connect();
    this.getChat();
  }

  connect() {

    this.socket.connect();
    let name = `${this.values.username}`;
    this.currentUser = name;
    this.socket.emit('set-name', name);

    this.socket.fromEvent('users-changed').subscribe(data => {
      let user = data['user'];
      if (data['event'] === 'left') {
        this.alertController.create({
          header: `User left`,
          message: `<b> User left: ${user} </b>`,
          buttons: [{
            text: 'OK'
          }]
        }).then(alert => alert.present());
      } else {
        this.alertController.create({
          header: `User joined`,
          message: `<b> User joined: ${user} </b>`,
          buttons: [{
            text: 'OK'
          }]
        }).then(alert => alert.present());
      }
    });

    this.socket.fromEvent('message').subscribe(message => {
      this.getChat();
    });
  }

  sendMessage() {
    const chat_users_id_received = this.values.users_id == this.buyer ? this.driver : this.buyer;
    this.chatService.getUsersId(chat_users_id_received).subscribe(res => {
      this.socket.emit('send-message', {
        bill_id: this.bill_id,
        users_id: this.values.users_id,
        chat_users_id_received: this.values.users_id == this.buyer ? this.driver : this.buyer,
        chat_users_username_received: res.data[0].users_username,
        chat_users_fullname: res.data[0].users_firstname + ' ' + res.data[0].users_lastname,
        chat_message: this.message
      });
      this.message = '';
    });
  }

  ionViewWillLeave() {
    this.socket.disconnect();
  }

  delivered() {
    this.loadingService.present();
    const body = {
      bill_id: this.bill_id
    }
    this.chatService.finish(body).subscribe((res: any) => {
      this.loadingService.dismiss();
      this.router.navigate(['/pending_payment']);
      this.alertController.create({
        header: `OK`,
        message: `<b> ${res.message} </b>`,
        buttons: [{
          text: 'OK'
        }]
      }).then((alert) => {
        alert.present().finally(() => {
          // this.router.navigate(['/pending_payment']);
        });
      });

    }, (err) => {
      this.loadingService.dismiss();
      this.alertController.create({
        header: `Error ${err.error.status}`,
        message: `<b> ${err.error.message} </b>`,
        buttons: [{
          text: 'OK'
        }]
      }).then(alert => alert.present());

    });

  }



  getChat() {
    this.chat = [];
    this.chatService.getChat(this.bill_id, this.buyer, this.driver).subscribe((res: any) => {
      this.messages = res.data;
      this.scrollToBottomOnInit();
    }, err => {
      // console.log(err);
    });
  }


}