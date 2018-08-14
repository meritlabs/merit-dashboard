import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rank-item',
  templateUrl: './rank-item.component.html',
  styleUrls: ['./rank-item.component.sass'],
})
export class RankItemComponent implements OnInit {
  constructor() {}

  @Input()
  item;
  rating: number;

  ngOnInit() {
    this.rating = parseFloat((this.item.anv / 1e8).toFixed(2));
  }
}
