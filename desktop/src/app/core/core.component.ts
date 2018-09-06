import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IAppState } from '@dashboard/common/reducers/app.reducer';
import { LoadRanks } from '@dashboard/common/actions/rank.action';
import { IRanks } from '@dashboard/common/models/ranks';
import { DashboardAPI_Service } from '@dashboard/common/services/dashboard-api.service';
import { LoadNodes } from '@dashboard/common/actions/nodes.action';
import { NetworkService } from '@dashboard/common/services/network.service';
import { ENV } from '@app/env';

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
  initialLoading: boolean = true;

  constructor(
    private router: Router,
    private store: Store<IAppState>,
    public dashboardAPI: DashboardAPI_Service,
    private networkService: NetworkService
  ) {}

  async ngOnInit() {
    this.checkCurrentRoute();
    this.router.events.subscribe(event => this.checkCurrentRoute());

    let ranks = (await this.dashboardAPI.getLeaderBoard()) as IRanks;
    ranks.loading = false;
    let core = { address: ENV.coreAddress, alias: '' };
    let _nodes = await this.networkService.getNetwork(core, 500);
    let wallets = await this.dashboardAPI.getWalletsAmount();
    this.store.dispatch(new LoadRanks(ranks));
    this.store.dispatch(new LoadNodes({ nodes: _nodes, toDisplay: 500, wallets: wallets }));
    this.initialLoading = false;
  }
  checkCurrentRoute() {
    if (this.router.url === '/network' || this.router.url === '/') {
      this.isNetworkView = true;
    } else {
      this.isNetworkView = false;
    }
  }
}
