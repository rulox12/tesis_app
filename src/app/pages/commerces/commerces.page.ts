import {Component, OnInit} from '@angular/core';
import {CommercesService} from '../../services/commerces.service';
import {ActivatedRoute, Router} from '@angular/router';
import {StorageHelper} from '../../helpers/storage.helper';
import {BillService} from '../../services/bill.service';
import {FavoriteService} from '../../services/favorite.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-commerces',
  templateUrl: './commerces.page.html',
  styleUrls: ['./commerces.page.scss'],
})
export class CommercesPage implements OnInit {
  id: any;
  document: '';
  commerce: any;
  user: any;
  favorite = false;
  public baseUrlForImage = environment.api + 'commerce/getImage/';

  constructor(
    private commerceService: CommercesService,
    private billService: BillService,
    private favoriteService: FavoriteService,
    private activeRoute: ActivatedRoute,
    private route: Router,
    private storageHelper: StorageHelper,
    private alertController: AlertController,
    private loadingCtrl: LoadingController
  ) {
  }

  async ngOnInit(): Promise<void> {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando',
      duration: 2000,
      spinner: 'circles',
    });

    loading.present();

    this.storageHelper.get('user').then(user => {
      if (user) {
        this.user = user;
      }
    });
    this.activeRoute.params.subscribe(params => {
      if (params.id) {
        this.commerceService.getCommerce(params.id).then(response => {
          if (response) {
            this.commerce = response;
            if (this.user && this.commerce) {
              this.favoriteService.existFavorite({
                // eslint-disable-next-line no-underscore-dangle
                user: this.user._id,
                // eslint-disable-next-line no-underscore-dangle
                commerce: this.commerce._id
              }).subscribe(responseCommerce => {
                this.favorite = responseCommerce.exist;
              });
            }
          }
        });
      }

    });
  }

  login() {
    this.storageHelper.remove('bills').then(r => {
      if (this.document) {
        // eslint-disable-next-line no-underscore-dangle
        this.billService.getBillsForDocument(this.commerce._id, this.document).then(response => {
          // eslint-disable-next-line no-underscore-dangle
          this.route.navigate(['/bills', {commerce: this.commerce._id, document: this.document}]);
        });
      }
    });
  }

  back() {
    this.route.navigate(['/tabs']);
  }

  getBillByDocument() {
    this.document = this.user.document;
    this.login();
  }

  addFavorite() {
    const request = {
      // eslint-disable-next-line no-underscore-dangle
      user: this.user._id,
      // eslint-disable-next-line no-underscore-dangle
      commerce: this.commerce._id
    };

    this.favoriteService.addFavorite(request).subscribe(async (response) => {
      const alert = await this.alertController.create({
        message: 'Agregado correctamente',
        buttons: ['perfecto'],
      });
      await alert.present().then(r => {
        this.ngOnInit();
      });
    });
  }

  deleteFavorite() {
    const request = {
      // eslint-disable-next-line no-underscore-dangle
      user: this.user._id,
      // eslint-disable-next-line no-underscore-dangle
      commerce: this.commerce._id
    };

    this.favoriteService.deleteFavorite(request).subscribe(async (response) => {
      const alert = await this.alertController.create({
        message: 'Eliminado correctamente',
        buttons: ['perfecto'],
      });
      await alert.present().then(r => {
        this.ngOnInit();
      });
    });
  }
}
