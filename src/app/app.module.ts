import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './core/components/app-header/app-header.component';
import { RankViewComponent } from './core/rank-view/rank-view.component';
import { RankItemComponent } from './core/components/rank/rank-item/rank-item.component';
import { RanksService } from '../common/services/rank.service.service';

const appRoutes: Routes = [{ path: '', component: RankViewComponent }];

@NgModule({
  declarations: [AppComponent, AppHeaderComponent, RankViewComponent, RankItemComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
  ],
  providers: [RanksService],
  bootstrap: [AppComponent],
})
export class AppModule {}
