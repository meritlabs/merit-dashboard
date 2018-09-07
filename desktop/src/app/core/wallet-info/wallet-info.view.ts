import { Component } from '@angular/core';
import { DashboardAPI_Service } from '@dashboard/common/services/dashboard-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-wallet-info-view',
  templateUrl: './wallet-info.view.html',
  styleUrls: ['./wallet-info.view.sass'],
})
export class WalletInfoViewComponent {
  formData: FormGroup = this.formBuilder.group({
    wallet: ['', [Validators.required]],
  });
  isValid: boolean;
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
    let getAddress: any = (await this.dashboardApi.validateAddress(address)) as any;
    let isValid: any = getAddress.isValid;

    if (isValid) {
      let walletBalance: any = await this.dashboardApi.getAddressBalance(getAddress.address);
      let rank: any;
      let referralsMap: any = await this.dashboardApi.getAddressNetwork(getAddress.address);

      this.pushCrumb(getAddress);
      this.isValid = true;
      this.address = getAddress;
      this.address.balance = walletBalance.totalAmount / 1e8;

      if (getAddress.isConfirmed) {
        rank = (await this.dashboardApi.getAddressRank(getAddress.address)) as any;
        this.address.top = rank.rank;
        this.address.rank = rank.anv;
        this.address.referralsMap = referralsMap;
      }
      this.isLoading = false;
    } else {
      this.isLoading = false;
      this.isValid = false;
      this.formData.controls['wallet'].setErrors({ invalid: true });
    }
  }
  findAddress(address) {
    this.breadCrumbs.length = 0;
    this.validateAddress(address);
  }
  selectCrumb(item) {
    var index = this.breadCrumbs.indexOf(item);
    if (index > -1) {
      this.breadCrumbs.length = index + 1;
    }
    this.validateAddress(item.address);
  }
  pushCrumb(getAddress) {
    let crumb = {
      name: getAddress.alias || 'Anonymous',
      address: getAddress.address,
    };
    let isExist = this.breadCrumbs.find(item => getAddress.address === item.address);

    if (!isExist) {
      this.breadCrumbs.push(crumb);
    }
  }
}
