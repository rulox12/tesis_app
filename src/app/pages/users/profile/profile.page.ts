import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {StorageHelper} from '../../../helpers/storage.helper';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: any;
  userForm: FormGroup;
  passwordForm: FormGroup;
  editPassword = false;

  constructor(
    private route: Router,
    private storageHelper: StorageHelper,
    private userService: AuthService,
    public formBuilder: FormBuilder,
    private alertController: AlertController
  ) {
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      phone: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      document: ['', [Validators.required, Validators.minLength(2)]],
    });
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(2)]],
      newPassword: ['', [Validators.required, Validators.minLength(2)]],
    });
    this.updateFormUser();
  }

  back() {
    this.route.navigate(['/tabs/tab3']);
  }

  logout() {
    this.storageHelper.remove('user').then(response => {
      this.route.navigate(['/tabs/tab1']).then(() => {
        window.location.reload();
      });
    });
  }

  submitForm() {
    if (this.userForm.valid) {
      // eslint-disable-next-line no-underscore-dangle
      this.userService.updateUser(this.userForm.value, this.user?._id).subscribe(async response => {
        if (response) {
          this.storageHelper.set('user', response);
          this.updateFormUser();
          const alert = await this.alertController.create({
            message: 'Actualizacion realizada con exito',
            buttons: ['Ok'],
          });
          await alert.present();
        }
      });
    }
  }

  private updateFormUser() {
    this.storageHelper.get('user').then(user => {
      this.user = user;
      this.userForm.patchValue({
        name: this.user?.name,
        surname: this.user?.surname,
        phone: this.user?.phone,
        document: this.user?.document,
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public async presentFormPassword() {
    const alert = await this.alertController.create({
      header: 'Cambiar contraseña',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (data) => {
          this.editPassword = false;
        }
      }, {
        text: 'Ok',
        handler: () => {
          this.editPassword = true;
        }
      }],
      inputs: [
        {
          type: 'password',
          name: 'password',
          placeholder: 'Ingrese contraseña antigua',
        },
        {
          type: 'password',
          name: 'newPassword',
          placeholder: 'Ingrese contraseña nueva',
        }
      ],
    });

    alert.onWillDismiss().then(data => {
      if (this.editPassword) {
        // eslint-disable-next-line no-underscore-dangle
        this.userService.changePassword(data.data.values, this.user?._id).subscribe(async response => {
          if (response) {
            const alertPassword = await this.alertController.create({
              message: response.message,
              buttons: [{
                text: 'Ok',
              }],
            });
            await alertPassword.present();
          }
        });
      }
    });
    alert.present().then();
  }
}
