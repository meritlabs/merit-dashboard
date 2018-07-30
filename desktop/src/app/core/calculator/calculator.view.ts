import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-calculator-view',
  templateUrl: './calculator.view.html',
  styleUrls: ['./calculator.view.sass'],
})
export class CalculatorViewComponent {
  formData: FormGroup = this.formBuilder.group({
    cyclesps: ['', [Validators.required, Validators.pattern(/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/)]],
  });
  avgHashRate: number = 1392.955;
  dailyReward: number;
  constructor(private formBuilder: FormBuilder) {}

  calculate(val) {
    val = val.replace(',', '.');
    this.formData.controls.cyclesps.setValue(val);

    if (this.formData.status === 'VALID') {
      val = parseFloat(val);
      let ratio = val / this.avgHashRate;
      this.dailyReward = 24 * 60 * 13 * ratio;
    }
  }
}
