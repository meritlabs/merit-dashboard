import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from '@dashboard/common/reducers/app.reducer';
import { Observable } from 'rxjs/Observable';
import { IRanks } from '@dashboard/common/models/ranks';

@Component({
  selector: 'app-rank-view',
  templateUrl: './rank.view.html',
  styleUrls: ['./rank.view.sass'],
})
export class RankViewComponent implements OnInit {
  constructor(private store: Store<IAppState>) {}

  ranks$: Observable<IRanks> = this.store.select('ranks');
  ngOnInit() {}
}
