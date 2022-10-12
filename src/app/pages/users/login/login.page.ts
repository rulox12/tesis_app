import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {StorageHelper} from '../../../helpers/storage.helper';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AlertController, LoadingController, NavController} from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;


  constructor(
    private authService: AuthService,
    private storageHelper: StorageHelper,
    public formBuilder: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private navController: NavController
  ) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  async submitFormLogin() {
    if (this.loginForm.valid) {
      const loading = await this.loadingCtrl.create({
        message: 'Cargando',
        spinner: 'circles',
      });
      loading.present();
      await this.authService.signIn(this.loginForm.value).subscribe(async response => {
        if (response) {
          this.storageHelper.set('user', response.user);
          setTimeout(() => {
            loading.dismiss();
            this.router.navigate(['/tabs/tab3', {id: 1}]).then(() => {
              window.location.reload();
            });
          }, 2000);

        }
      }, async error => {
        loading.dismiss();
        const alert = await this.alertController.create({
          message: 'Error al ingresar',
          buttons: ['Ok'],
        });
        await alert.present();
      });
    } else {
      const alert = await this.alertController.create({
        message: 'Por favor ingrese correctamente la informacion solicitada',
        buttons: ['Ok'],
      });
      await alert.present();
    }
  }

  go(route: string) {
    this.router.navigate([route]);
  }

  back() {
    this.router.navigate(['/tabs/tab1']);
  }
}
