import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { DashboardAPI_Service } from '@dashboard/common/services/dashboard-api.service';
import { Stats } from '@dashboard/common/models/stats';

@Component({
  selector: 'app-stats-view',
  templateUrl: './stats.view.html',
  styleUrls: ['./stats.view.sass'],
})
export class StatsViewComponent implements OnInit {
  constructor(public dashboardAPI: DashboardAPI_Service) {}

  stats: Stats;

  async ngOnInit() {
    let Stats = (await this.dashboardAPI.getStats()) as Stats;
    Stats.networkCyclesPS = parseFloat(Stats.networkCyclesPS.toFixed(0));
    Stats.networkAvgCyclesPS = parseFloat(Stats.networkAvgCyclesPS.toFixed(0));
    Stats.currentBlock.difficulty = parseFloat(Stats.currentBlock.difficulty.toFixed(0));
    Stats.lastRetargetBlock.timestamp = `${moment(Stats.lastRetargetBlock.timestamp).format('MMM Do YYYY, hh:mm A')}`;
    Stats.lastRetargetInBlocks = Stats.retargetInBlocks;
    Stats.retargetIn = moment(Stats.retargetTimestamp * 1000).fromNow();
    Stats.retargetAt = moment(Stats.retargetTimestamp * 1000).format('MMM Do YYYY, hh:mm A');
    Stats.retargetDifficulty = parseFloat(Stats.retargetDifficulty.toFixed(0));
    Stats.currentSupply = Stats.currentBlock.height * 20;

    this.stats = Stats;
  }
}
