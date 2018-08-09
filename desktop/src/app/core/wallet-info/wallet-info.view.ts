import { Component } from '@angular/core';
import { DashboardAPI_Service } from '@dashboard/common/services/dashboard-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private formBuilder: FormBuilder, public dashboardApi: DashboardAPI_Service) {}

  async validate(address) {
    this.isLoading = true;
    let getAddress: any = (await this.dashboardApi.validateAddress(address)) as any;
    let isValid: any = getAddress.isValid;

    if (isValid) {
      let walletBalance: any = await this.dashboardApi.getAddressBalance(getAddress.address);
      let ranks: any;
      let referralsMap: any = await this.dashboardApi.getAddressNetwork(getAddress.address);

      this.isValid = true;
      this.address = getAddress;
      this.address.balance = walletBalance.totalAmount / 1e8;

      if (getAddress.isConfirmed) {
        ranks = ((await this.dashboardApi.getAddressRank(getAddress.address)) as any).ranks[0];
        this.address.top = ranks.rank;
        this.address.rank = (ranks.anv / 1e8).toFixed(0);
        this.address.referralsMap = referralsMap;
      }
      this.isLoading = false;
    } else {
      this.isLoading = false;
      this.isValid = false;
      (this.formData.controls.wallet as any).status = 'INVALID';
    }
  }
}
