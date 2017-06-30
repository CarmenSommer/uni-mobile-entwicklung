import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import {Auth, User, IDetailedError, Push, PushToken} from '@ionic/cloud-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  userCredentials = {};
  awesomeness = 0;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public auth: Auth, public user: User, public iab: InAppBrowser, public push: Push) {
    this.awesomeness = this.user.get('awesomeness', -1);

    this.push.register().then((t: PushToken) => {
      return this.push.saveToken(t);
    }).then((t: PushToken) => {
      console.log('Token saved: ', t.token);
    });

    this.push.rx.notification().subscribe((msg) => {
      let alert = this.alertCtrl.create({
        title: msg.title,
        subTitle: msg.text,
        buttons: ['Okay']
      });
      alert.present();
    });

  }

  setDetails(){
    this.user.set('awesomeness', '9001');
    this.user.save();
    this.user.load().then(_ => {
      this.awesomeness = this.user.get('awesomeness', -1);
    });

  }

signup(){
  this.auth.signup(this.userCredentials).then(_ => {
      console.log('current user : ', this.user);
    }, (err: IDetailedError<string[]>) => {
      this.showAlert(err.message);
    });
  }

  login(){
    this.auth.login('basic', this.userCredentials).then(_ => {
      console.log('current user:', this.user);
    });
  }

  logout(){
    this.auth.logout();
  }

  resetPassword(){
    let resetUrl = this.auth.passwordResetUrl;
    const browser = this.iab.create(resetUrl);
  }

  showAlert(msg){
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: msg,
      buttons: ['Okay']
    })
    alert.present();
  }

  

}
