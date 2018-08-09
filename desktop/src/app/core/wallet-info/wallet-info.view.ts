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
  address: {};
  constructor(private formBuilder: FormBuilder, public dashboardApi: DashboardAPI_Service) {}
  async validate(address) {
    let getAddress: any = (await this.dashboardApi.validateAddress(address)) as any;
    let isValid: any = getAddress.isValid;
    if (isValid) {
      this.isValid = true;
      this.address = getAddress;
      console.log(getAddress);
    }
  }
}
