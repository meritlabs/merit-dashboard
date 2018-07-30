import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreRoutingModule } from '@dashboard/desktop/app/core/core-routing.module';
import { CoreComponent } from '@dashboard/desktop/app/core/core.component';
import { RankViewComponent } from '@dashboard/desktop/app/core/rank/rank.view';
import { CoreComponentsModule } from '@dashboard/desktop/app/core/components/core-components.module';
import { MiningViewComponent } from '@dashboard/desktop/app/core/mining-info/mining.view';
import { StatsViewComponent } from '@dashboard/desktop/app/core/stats/stats.view';
import { NetworkViewComponent } from '@dashboard/desktop/app/core/network/network.view';
import { CalculatorViewComponent } from '@dashboard/desktop/app/core/calculator/calculator.view';

export function getPages() {
  return [RankViewComponent, MiningViewComponent, StatsViewComponent, NetworkViewComponent, CalculatorViewComponent];
}

@NgModule({
  entryComponents: [CoreComponent, ...getPages()],
  imports: [CommonModule, CoreRoutingModule, CoreComponentsModule, ReactiveFormsModule, FormsModule],
  declarations: [CoreComponent, ...getPages()],
})
export class CoreModule {}
