import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoreComponent } from '@dashboard/desktop/app/core/core.component';
import { RankViewComponent } from '@dashboard/desktop/app/core/rank/rank.view';
import { MiningViewComponent } from '@dashboard/desktop/app/core/mining-info/mining.view';

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: [
      { path: '', component: RankViewComponent },
      { path: 'ranks', component: RankViewComponent },
      { path: 'mining', component: MiningViewComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
