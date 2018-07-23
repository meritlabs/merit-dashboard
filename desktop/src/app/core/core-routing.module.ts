import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoreComponent } from '@dashboard/desktop/app/core/core.component';

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: [{ path: '**', redirectTo: '/' }, { path: '**', redirectTo: '/' }, { path: '**', redirectTo: '/' }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
