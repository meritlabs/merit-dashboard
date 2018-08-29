import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashboardAPI_Service } from '@dashboard/common/services/dashboard-api.service';
import { ENV } from '@app/env';

@Component({
  selector: 'app-calculator-view',
  templateUrl: './calculator.view.html',
  styleUrls: ['./calculator.view.sass'],
})
export class CalculatorViewComponent {
  formData: FormGroup = this.formBuilder.group({
    cyclesps: ['', [Validators.required, Validators.pattern(/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/)]],
  });
  avgHashRate: number;
  dailyReward: number;
  constructor(private formBuilder: FormBuilder, public dashboardAPI: DashboardAPI_Service) {}

  async ngOnInit() {
    let hashRateSum = 0;
    Array.prototype.slice.apply(await this.dashboardAPI.getMiningHistoryInfo(ENV.nPowTargetTimeSpan)).map(item => {
      hashRateSum += item.networkCyclesPS;
    });

    this.avgHashRate = hashRateSum / ENV.nPowTargetTimeSpan;
  }

  calculate(val) {
    val = val.replace(',', '.');
    this.formData.controls.cyclesps.setValue(val);

    if (this.formData.status === 'VALID') {
      val = parseFloat(val);
      let ratio = val / this.avgHashRate;
      let probability = 0.4;
      this.dailyReward = parseFloat(((14400 - 14400 * probability) * ratio).toFixed(2));
    }
  }
}
