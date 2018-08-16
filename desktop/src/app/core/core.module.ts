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
import { WalletInfoViewComponent } from '@dashboard/desktop/app/core/wallet-info/wallet-info.view';
import { MomentPipe } from '@dashboard/common/pipes/moment';
import { KFormat } from '@dashboard/common/pipes/k-format';
import { DisifiViewComponent } from '@dashboard/desktop/app/core/disifi-project/disifi-project.view';

export function getPages() {
  return [
    RankViewComponent,
    MiningViewComponent,
    StatsViewComponent,
    NetworkViewComponent,
    CalculatorViewComponent,
    WalletInfoViewComponent,
    DisifiViewComponent,
  ];
}

@NgModule({
  entryComponents: [CoreComponent, ...getPages()],
  imports: [CommonModule, CoreRoutingModule, CoreComponentsModule, ReactiveFormsModule, FormsModule],
  declarations: [CoreComponent, ...getPages(), MomentPipe, KFormat],
})
export class CoreModule {}
