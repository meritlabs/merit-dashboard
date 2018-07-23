import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppHeaderComponent } from '@dashboard/desktop/app/core/components/app-header/app-header.component';
import { RankItemComponent } from '@dashboard/desktop/app/core/components/rank/rank-item/rank-item.component';

export function getComponents() {
  return [AppHeaderComponent, RankItemComponent];
}

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: getComponents(),
  exports: getComponents(),
})
export class CoreComponentsModule {}
