import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './core/components/app-header/app-header.component';
import { RankViewComponent } from './core/rank-view/rank-view.component';
import { RankItemComponent } from './core/components/rank/rank-item/rank-item.component';

const appRoutes: Routes = [{ path: '', component: RankViewComponent }];

@NgModule({
  declarations: [AppComponent, AppHeaderComponent, RankViewComponent, RankItemComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
