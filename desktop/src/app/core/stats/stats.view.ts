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
    retargetInHours: '',
    retarget100InHours: '',
    retargetTimestamp: '',
    retarget100Timestamp: '',
    retargetDifficulty: 0,
    retarget100Difficulty: 0,
  };

  async ngOnInit() {
    let currentBlockHash = (await this.dashboardAPI.getBlocksInfo(1, 1))[0].hash;
    let getBlocks = Array.prototype.slice.apply(await this.dashboardAPI.getBlocksInfo(10000, 1));
    let getMiningInfo = Array.prototype.slice.apply(await this.dashboardAPI.getMiningHistoryInfo(30));
    let totalCpS = 0;
    let blockTime = await this.getBlockTime(30);
    getMiningInfo.map(item => {
      totalCpS += item.networkCyclesPS;
    });

    this.stats.lastReTargetBlock = getBlocks.find(item => item.height % 1440 === 0);
    this.stats.networkCyclesPS = getMiningInfo[0].networkCyclesPS.toFixed(0);
    this.stats.networkAvgCyclesPS = (totalCpS / 30).toFixed(0);
    this.stats.currentBlock = await this.dashboardAPI.getBlock(currentBlockHash);
    this.stats.currentBlock.difficulty = this.stats.currentBlock.difficulty.toFixed(0);
    this.stats.blockTime = blockTime;
    this.stats.reTargetInBlocks = this.stats.currentBlock.height - this.stats.lastReTargetBlock.height;
    this.stats.reTargetIn = moment(this.stats.lastReTargetBlock.timestamp).format('MM-DD-YY, h:mm A');

    let rtBasedSinceRetarget = await this.getNextRetargetTimeInSeconds(
      this.stats.currentBlock.height,
      this.stats.currentBlock.height % 100
    );
    let rtBasedLast100Blocks = await this.getNextRetargetTimeInSeconds(this.stats.currentBlock.height, 100);

    this.stats.retargetInHours = this.getRetargetInPredictionTime(rtBasedSinceRetarget);
    this.stats.retarget100InHours = this.getRetargetInPredictionTime(rtBasedLast100Blocks);
    this.stats.retargetTimestamp = this.getRetargetPredictionDateTime(rtBasedSinceRetarget);
    this.stats.retarget100Timestamp = this.getRetargetPredictionDateTime(rtBasedLast100Blocks);
    this.stats.retargetDifficulty = await this.getNextDifficulty(
      this.stats.currentBlock.height,
      this.stats.currentBlock.difficulty,
      this.stats.currentBlock.height % 1440
    );
    this.stats.retarget100Difficulty = await this.getNextDifficulty(
      this.stats.currentBlock.height,
      this.stats.currentBlock.difficulty,
      100
    );
    console.log(this.stats);
  }
  async getNextRetargetTimeInSeconds(currentBlock, blocksAgoToStart) {
    let singleBlockTime = parseFloat(await this.getBlockTime(blocksAgoToStart));
    let blocksToRetarget = 1440 - (currentBlock % 1440);
    return Math.round(singleBlockTime * blocksToRetarget);
  }
  async getBlockTime(blocksAgoToStart) {
    let getMiningInfo = await this.dashboardAPI.getMiningHistoryInfo(blocksAgoToStart);
    Array.prototype.slice.apply(getMiningInfo);
    let blockTimeStart = Date.parse(getMiningInfo[0].timestamp);
    let blockTimeEnd = Date.parse(getMiningInfo[blocksAgoToStart - 1].timestamp);
    return ((blockTimeStart - blockTimeEnd) / 1000 / 30).toFixed(0);
  }
  getRetargetInPredictionTime(val) {
    let rtHours = Math.floor(val / 3600);
    let reMinutes = Math.floor((val % 3600) / 60);
    return `${rtHours}:${reMinutes}`;
  }
  getRetargetPredictionDateTime(val) {
    let timeNowInMs = Date.parse(new Date().toString());
    let nexRtInMs = val * 1000;
    return moment(timeNowInMs + nexRtInMs).format('MM-DD-YY, h:mm A');
  }
  async getNextDifficulty(currentBlock, currentDiff, blocksAgoToStart) {
    let blocksSinceRetarget = currentBlock % 1440;
    let blocksToRetarget = 1440 - blocksSinceRetarget;

    let singleBlockTimeSinceRetarget = parseFloat(await this.getBlockTime(blocksSinceRetarget));
    let singleBlockTime = parseFloat(await this.getBlockTime(blocksAgoToStart));

    console.log(singleBlockTimeSinceRetarget);
    console.log(singleBlockTime);

    let total_time = blocksSinceRetarget * singleBlockTimeSinceRetarget + blocksToRetarget * singleBlockTime;
    let coefficient = total_time / (24 * 360);
    return Math.round(currentDiff / coefficient);
  }
}
