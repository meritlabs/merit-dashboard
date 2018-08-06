import { Component, OnInit } from '@angular/core';
import MiningService from '@dashboard/common/services/mining.stats.service';

@Component({
  selector: 'app-stats-view',
  templateUrl: './stats.view.html',
  styleUrls: ['./stats.view.sass'],
})
export class StatsViewComponent implements OnInit {
  constructor(public miningService: MiningService) {}
  async ngOnInit() {
    let stats = await this.miningService.getMiningStats();
    console.log(stats);
  }
}
