import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kformat',
})
export class KFormat implements PipeTransform {
  transform(value: number): string {
    if (value > 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    } else {
      return `${value}`;
    }
  }
}
