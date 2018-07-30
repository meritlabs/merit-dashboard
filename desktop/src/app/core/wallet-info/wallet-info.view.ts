import { Component } from '@angular/core';
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
  constructor(private formBuilder: FormBuilder) {}
  validate(wallet) {
    console.log(wallet);
  }
}
