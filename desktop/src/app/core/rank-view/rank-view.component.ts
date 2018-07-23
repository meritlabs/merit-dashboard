import { Component, OnInit } from '@angular/core';
import { RanksService } from '@dashboard/common/services/rank.service.service';

@Component({
  selector: 'app-rank-view',
  templateUrl: './rank-view.component.html',
  styleUrls: ['./rank-view.component.scss'],
})
export class RankViewComponent implements OnInit {
  constructor(private ranksService: RanksService) {}

  ranks: any;
  async ngOnInit() {
    this.ranks = await this.ranksService.getRank(100).toPromise();
  }
}
