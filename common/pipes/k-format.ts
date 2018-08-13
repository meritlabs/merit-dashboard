import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kformat',
})
export class KFormat implements PipeTransform {
  transform(value: any): string {
    if (!value) value = 0;
    if (value > 1000) {
      value = parseFloat((value / 1000).toFixed(2)) * 1;
      if (value - parseFloat(value.toFixed(0)) > 0) {
        value = `${value.toFixed(1)}K`;
      } else {
        value = `${value.toFixed(0)}K`;
      }
    }

    return `${value}`;
  }
}
