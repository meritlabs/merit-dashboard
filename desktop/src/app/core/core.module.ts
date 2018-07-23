import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreRoutingModule } from '@dashboard/desktop/app/core/core-routing.module';
import { CoreComponent } from '@dashboard/desktop/app/core/core.component';
import { RankViewComponent } from '@dashboard/desktop/app/core/rank-view/rank-view.component';
import { CoreComponentsModule } from '@dashboard/desktop/app/core/components/core-components.module';

export function getPages() {
  return [RankViewComponent];
}

@NgModule({
  entryComponents: [CoreComponent, ...getPages()],
  imports: [CommonModule, CoreRoutingModule, CoreComponentsModule, ReactiveFormsModule, FormsModule],
  declarations: [CoreComponent, ...getPages()],
})
export class CoreModule {}
