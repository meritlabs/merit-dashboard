import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from '@dashboard/common/reducers/app.reducer';
import { LoadRanks } from '@dashboard/common/actions/rank.action';
import { IRanks } from '@dashboard/common/models/ranks';
import { DashboardAPI_Service } from '@dashboard/common/services/dashboard-api.service';

@Component({
  selector: 'app-rank-view',
  templateUrl: './rank.view.html',
  styleUrls: ['./rank.view.sass'],
})
export class RankViewComponent implements OnInit {
  constructor(private store: Store<IAppState>, public dashboardAPI: DashboardAPI_Service) {}

  ranks$ = this.store.select('ranks');
  async ngOnInit() {
    let ranks = (await this.dashboardAPI.getLeaderBoard()) as IRanks;
    ranks.loading = false;
    this.store.dispatch(new LoadRanks(ranks));
  }
}
