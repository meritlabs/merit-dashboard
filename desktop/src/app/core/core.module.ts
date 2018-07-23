import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreRoutingModule } from '@dashboard/desktop/app/core/core-routing.module';
import { RankViewComponent } from '@dashboard/desktop/app/core/rank-view/rank-view.component';
import { CoreComponent } from '@dashboard/desktop/app/core/core.component';

export function getPages() {
  return [];
}

@NgModule({
  entryComponents: [RankViewComponent, ...getPages()],
  imports: [CommonModule, CoreRoutingModule, ReactiveFormsModule, RankViewComponent, FormsModule],
  declarations: [CoreComponent, ...getPages()],
})
export class CoreModule {}
