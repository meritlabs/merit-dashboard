import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { DashboardAPI_Service } from '@dashboard/common/services/dashboard-api.service';

@Component({
  selector: 'app-stats-view',
  templateUrl: './stats.view.html',
  styleUrls: ['./stats.view.sass'],
})
export class StatsViewComponent implements OnInit {
  constructor(public dashboardAPI: DashboardAPI_Service) {}

  stats: any = {
    currentBlock: {},
    blocksToReTarget: 0,
    networkAvgCyclesPS: 0,
    blockTime: 0,
    lastReTargetBlock: {},
    reTargetInBlocks: 0,
    reTargetIn: '',
    retargetInHours: '',
    retarget100InHours: '',
    retargetTimestamp: '',
    retarget100Timestamp: '',
    retargetDifficulty: 0,
    retarget100Difficulty: 0,
  };

  async ngOnInit() {
    this.stats = await this.dashboardAPI.getStats();
  }
}
