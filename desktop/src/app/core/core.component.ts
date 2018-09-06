import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IAppState } from '@dashboard/common/reducers/app.reducer';
import { LoadRanks } from '@dashboard/common/actions/rank.action';
import { IRanks } from '@dashboard/common/models/ranks';
import { DashboardAPI_Service } from '@dashboard/common/services/dashboard-api.service';

@Component({
  selector: 'core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class CoreComponent {
  topMenuItems: any[] = [];
  bottomMenuItems: any[] = [];
  isNetworkView: boolean;

  constructor(private router: Router, private store: Store<IAppState>, public dashboardAPI: DashboardAPI_Service) {}

  async ngOnInit() {
    this.checkCurrentRoute();
    this.router.events.subscribe(event => this.checkCurrentRoute());

    let ranks = (await this.dashboardAPI.getLeaderBoard()) as IRanks;
    ranks.loading = false;
    this.store.dispatch(new LoadRanks(ranks));
  }
  checkCurrentRoute() {
    if (this.router.url === '/network' || this.router.url === '/') {
      this.isNetworkView = true;
    } else {
      this.isNetworkView = false;
    }
  }
}
