import { Component, OnInit } from '@angular/core';
import { DashboardAPI_Service } from '@dashboard/common/services/dashboard-api.service';

@Component({
  selector: 'app-stats-view',
  templateUrl: './stats.view.html',
  styleUrls: ['./stats.view.sass'],
})
export class StatsViewComponent implements OnInit {
  constructor(public dashboardAPI: DashboardAPI_Service) {}
  async ngOnInit() {
    let stats = await this.dashboardAPI.getMiningInfo();
    console.log(stats);
  }
}
