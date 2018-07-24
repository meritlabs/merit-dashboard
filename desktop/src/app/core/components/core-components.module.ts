import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppHeaderComponent } from '@dashboard/desktop/app/core/components/app-sidebar/app-sidebar.component';
import { RankItemComponent } from '@dashboard/desktop/app/core/components/rank/rank-item/rank-item.component';
import { LoadingSpinnerComponent } from '@dashboard/desktop/app/core/components/loading-spinner/loading-spinner-small.component';
import { MeritIconComponent } from '@dashboard/desktop/app/core/components/merit-icon/merit-icon.component';

export function getComponents() {
  return [AppHeaderComponent, RankItemComponent, LoadingSpinnerComponent, MeritIconComponent];
}

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: getComponents(),
  exports: getComponents(),
})
export class CoreComponentsModule {}
