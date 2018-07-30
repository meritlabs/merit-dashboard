import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoreComponent } from '@dashboard/desktop/app/core/core.component';
import { RankViewComponent } from '@dashboard/desktop/app/core/rank/rank.view';
import { MiningViewComponent } from '@dashboard/desktop/app/core/mining-info/mining.view';
import { StatsViewComponent } from '@dashboard/desktop/app/core/stats/stats.view';
import { NetworkViewComponent } from '@dashboard/desktop/app/core/network/network.view';
import { CalculatorViewComponent } from '@dashboard/desktop/app/core/calculator/calculator.view';

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: [
      { path: '', component: NetworkViewComponent },
      { path: 'ranks', component: RankViewComponent },
      { path: 'mining', component: MiningViewComponent },
      { path: 'stats', component: StatsViewComponent },
      { path: 'network', component: NetworkViewComponent },
      { path: 'calculator', component: CalculatorViewComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
