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
    const nPowTargetTimeSpan = 1440;
    const blocksAgo = 30;
    const blocksAgoToStart = 100;

    let currentBlockHash = (await this.dashboardAPI.getBlocksInfo(1, 1))[0].hash;
    let currentBlock: any = await this.dashboardAPI.getBlock(currentBlockHash);
    let currentBlockN = currentBlock.height;
    let getBlocks = Array.prototype.slice.apply(await this.dashboardAPI.getBlocksInfo(10000, 1));
    let getMiningInfo = Array.prototype.slice.apply(await this.dashboardAPI.getMiningHistoryInfo(blocksAgo));
    let lastReTargetBlock = getBlocks.find(item => item.height % nPowTargetTimeSpan === 0);
    let blockTime = await this.getBlockTime(blocksAgo);
    let networkCyclesPS = getMiningInfo[0].networkCyclesPS.toFixed(0);
    let networkAvgCyclesPS = 0;
    let currentBlockDifficulty = currentBlock.difficulty.toFixed(0);
    let totalCpS = 0;
    let rtBasedSinceRetarget = await this.getNextRetargetTimeInSeconds(
      currentBlockN,
      currentBlockN % nPowTargetTimeSpan
    );
    let rtBasedLast100Blocks = await this.getNextRetargetTimeInSeconds(currentBlockN, blocksAgoToStart);
    let reTargetIn = moment(lastReTargetBlock.timestamp).format('MM-DD-YY, h:mm A');
    let retargetInHours = this.getRetargetInPredictionTime(rtBasedSinceRetarget);
    let retarget100InHours = this.getRetargetInPredictionTime(rtBasedLast100Blocks);
    let reTargetInBlocks = currentBlockN - lastReTargetBlock.height;
    let retargetTimestamp = this.getRetargetPredictionDateTime(rtBasedSinceRetarget);
    let retarget100Timestamp = this.getRetargetPredictionDateTime(rtBasedLast100Blocks);
    let retargetDifficulty = await this.getNextDifficulty(
      currentBlockN,
      currentBlockDifficulty,
      currentBlockN % nPowTargetTimeSpan
    );
    let retarget100Difficulty = await this.getNextDifficulty(currentBlockN, currentBlockDifficulty, blocksAgoToStart);
    getMiningInfo.map(item => {
      totalCpS += item.networkCyclesPS;
    });
    networkAvgCyclesPS = parseFloat((totalCpS / blocksAgo).toFixed(0));

    this.stats.lastReTargetBlock = lastReTargetBlock;
    this.stats.networkCyclesPS = networkCyclesPS;
    this.stats.networkAvgCyclesPS = networkAvgCyclesPS;
    this.stats.currentBlock = currentBlock;
    this.stats.currentBlock.difficulty = currentBlockDifficulty;
    this.stats.blockTime = blockTime;
    this.stats.reTargetInBlocks = reTargetInBlocks;
    this.stats.reTargetIn = reTargetIn;
    this.stats.retargetInHours = retargetInHours;
    this.stats.retarget100InHours = retarget100InHours;
    this.stats.retargetTimestamp = retargetTimestamp;
    this.stats.retarget100Timestamp = retarget100Timestamp;
    this.stats.retargetDifficulty = retargetDifficulty;
    this.stats.retarget100Difficulty = retarget100Difficulty;
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
    let nexRtInMs = val;

    return moment(timeNowInMs + nexRtInMs).format('DD-MM-YY, h:mm A');
  }
  async getNextDifficulty(currentBlock, currentDiff, blocksAgoToStart) {
    let blocksSinceRetarget = currentBlock % 1440;
    let blocksToRetarget = 1440 - blocksSinceRetarget;
    let singleBlockTimeSinceRetarget = parseFloat(await this.getBlockTime(blocksSinceRetarget));
    let singleBlockTime = parseFloat(await this.getBlockTime(blocksAgoToStart));
    let total_time = blocksSinceRetarget * singleBlockTimeSinceRetarget + blocksToRetarget * singleBlockTime;
    let coefficient = total_time / (24 * 3600);

    return Math.round(currentDiff / coefficient);
  }
}
