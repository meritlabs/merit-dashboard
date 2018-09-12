import { Component } from '@angular/core';
import { DashboardAPI_Service } from '@dashboard/common/services/dashboard-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { ENV } from '@app/env';

@Component({
  selector: 'app-wallet-info-view',
  templateUrl: './wallet-info.view.html',
  styleUrls: ['./wallet-info.view.sass'],
})
export class WalletInfoViewComponent {
  formData: FormGroup = this.formBuilder.group({
    wallet: ['', [Validators.required]],
  });
  isLoading: boolean;
  address: any;
  breadCrumbs: Array<any> = [];

  constructor(
    private formBuilder: FormBuilder,
    public dashboardApi: DashboardAPI_Service,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      let address = params['address'];
      if (address) {
        this.validateAddress(address);
      }
    });
  }

  async validateAddress(address) {
    this.isLoading = true;
    let walletInfo = (await this.dashboardApi.getWalletInfo(address)) as any;
    this.isLoading = false;
    this.address = walletInfo.Info;
    if (!this.address.isvalid) {
      this.formData.controls['wallet'].setErrors({ invalid: true });
    } else {
      this.address.referrer = walletInfo.Referrer;
      this.pushCrumb(walletInfo.Referrer, true);
      this.pushCrumb(walletInfo.Info, false);
      if (this.address.isbeaconed === 1) {
        this.address.isbeaconed = true;
      } else {
        this.address.isbeaconed = false;
      }
      if (this.address.isconfirmed === 1) {
        this.address.isconfirmed = true;
        this.address.top = walletInfo.Rank.rank;
        this.address.balance = walletInfo.Rank.balance / 1e8;
        this.address.referralsMap = walletInfo.Referrals;
      } else {
        this.address.isconfirmed = false;
      }
    }
  }
  findAddress(address) {
    this.breadCrumbs.length = 0;
    this.validateAddress(address);
  }
  isRoot(address) {
    return address === ENV.startAddress;
  }
  selectCrumb(item) {
    var index = this.breadCrumbs.indexOf(item);
    if (index > -1) {
      this.breadCrumbs.length = index + 1;
    }
    this.validateAddress(item.address);
  }
  pushCrumb(getAddress, isParent) {
    let crumb = {
      name: getAddress.alias || 'Anonymous',
      address: getAddress.address,
    };
    let isExist = this.breadCrumbs.find(item => getAddress.address === item.address);

    if (!isExist) {
      if (!isParent) {
        this.breadCrumbs.push(crumb);
      } else {
        this.breadCrumbs.unshift(crumb);
      }
    }
  }
}
