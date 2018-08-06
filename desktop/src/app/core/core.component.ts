import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { DashboardAPI_Service } from '@dashboard/common/services/dashboard-api.service';
import { Store } from '@ngrx/store';
import { IAppState } from '@dashboard/common/reducers/app.reducer';
import { LoadRanks } from '@dashboard/common/actions/rank.action';
import { IRanks } from '@dashboard/common/models/ranks';
import { IBlocks } from '@dashboard/common/models/blocks';
import { LoadBlocks } from '@dashboard/common/actions/blocks.action';

@Component({
  selector: 'core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class CoreComponent {
  topMenuItems: any[] = [];
  bottomMenuItems: any[] = [];

  constructor(private store: Store<IAppState>, public dashboardAPI: DashboardAPI_Service) {}

  async ngOnInit() {
    let ranks = (await this.dashboardAPI.getLeaderBoard()) as IRanks;
    ranks.loading = false;
    this.store.dispatch(new LoadRanks(ranks));

    this.store.dispatch(new LoadBlocks({ loading: false, blocks: await this.dashboardAPI.getBlocksInfo() } as IBlocks));
  }
}
