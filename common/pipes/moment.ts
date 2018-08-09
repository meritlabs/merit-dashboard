import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'moment',
})
export class MomentPipe implements PipeTransform {
  transform(value: string): string {
    return moment(value).format('MM-DD-YY, h:mm A');
  }
}
