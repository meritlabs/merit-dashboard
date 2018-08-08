import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { DashboardAPI_Service } from '@dashboard/common/services/dashboard-api.service';
import { Store } from '@ngrx/store';
import { IAppState } from '@dashboard/common/reducers/app.reducer';

@Component({
  selector: 'app-stats-view',
  templateUrl: './stats.view.html',
  styleUrls: ['./stats.view.sass'],
})
export class StatsViewComponent implements OnInit {
  constructor(public dashboardAPI: DashboardAPI_Service, private store: Store<IAppState>) {}

  stats: any = {
    currentBlock: {},
    blocksToReTarget: 0,
    networkAvgCyclesPS: 0,
    blockTime: 0,
    lastReTargetBlock: {},
    reTargetInBlocks: 0,
    reTargetIn: '',
  };

  async ngOnInit() {
    let currentBlockHash = (await this.dashboardAPI.getBlocksInfo(1, 1))[0].hash;
    let getBlocks = Array.prototype.slice.apply(await this.dashboardAPI.getBlocksInfo(5000, 1));
    let getMiningInfo = Array.prototype.slice.apply(await this.dashboardAPI.getMiningHistoryInfo(30));
    let totalCpS = 0;
    let blockTimeStart = Date.parse(getMiningInfo[0].timestamp);
    let blockTimeEnd = Date.parse(getMiningInfo[29].timestamp);
    let blockTime = ((blockTimeStart - blockTimeEnd) / 1000 / 30).toFixed(1);
    getMiningInfo.map(item => {
      totalCpS += item.networkCyclesPS;
    });

    this.stats.lastReTargetBlock = getBlocks.find(item => item.height % 1440 === 0);
    this.stats.networkCyclesPS = getMiningInfo[0].networkCyclesPS.toFixed(2);
    this.stats.networkAvgCyclesPS = (totalCpS / 30).toFixed(2);
    this.stats.currentBlock = await this.dashboardAPI.getBlock(currentBlockHash);
    this.stats.currentBlock.difficulty = this.stats.currentBlock.difficulty.toFixed(3);
    this.stats.blockTime = blockTime;
    this.stats.reTargetInBlocks = this.stats.currentBlock.height - this.stats.lastReTargetBlock.height;
    this.stats.reTargetIn = moment(this.stats.lastReTargetBlock.timestamp).format('MM-DD-YY, h:mm A');

    console.log(this.stats);

    // 1440 - ($currentBlock % 1440);
    // console.log(await this.dashboardAPI.getBlocksInfo());
    // console.log(await this.dashboardAPI.getMiningInfo());
    // console.log(await this.dashboardAPI.getBestBlockHash());
    // console.log(await this.dashboardAPI.getBestBlock());
    // console.log(await this.dashboardAPI.getBlock(((await this.dashboardAPI.getBestBlock()) as any).hash));
  }
}
