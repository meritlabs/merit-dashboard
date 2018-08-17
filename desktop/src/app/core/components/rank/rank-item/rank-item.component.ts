import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rank-item',
  templateUrl: './rank-item.component.html',
  styleUrls: ['./rank-item.component.sass'],
})
export class RankItemComponent {
  constructor() {}

  @Input()
  item;
  rating: number;
}
