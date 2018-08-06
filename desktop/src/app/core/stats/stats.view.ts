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

  async ngOnInit() {
    // console.log(await this.dashboardAPI.getMiningHistoryInfo());
    // console.log(await this.dashboardAPI.getBlocksInfo());
    // console.log(await this.dashboardAPI.getMiningInfo());
    // console.log(await this.dashboardAPI.getBestBlockHash());
    // console.log(await this.dashboardAPI.getBestBlock());
    // console.log(await this.dashboardAPI.getBlock(((await this.dashboardAPI.getBestBlock()) as any).hash));
  }
  log(val) {
    console.log(val);
  }
}
