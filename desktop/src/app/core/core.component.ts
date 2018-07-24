import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { RanksService } from '@dashboard/common/services/rank.service.service';
import { Store } from '@ngrx/store';
import { IAppState } from '@dashboard/common/reducers/app.reducer';
import { LoadRanks } from '@dashboard/common/actions/rank.action';
import { IRanks } from '@dashboard/common/models/ranks';

@Component({
  selector: 'core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class CoreComponent {
  topMenuItems: any[] = [];
  bottomMenuItems: any[] = [];

  constructor(private store: Store<IAppState>, public ranksService: RanksService) {}

  async ngOnInit() {
    let ranks = (await this.ranksService.getRank(100).toPromise()) as IRanks;
    ranks.loading = false;
    this.store.dispatch(new LoadRanks(ranks));
  }
}
