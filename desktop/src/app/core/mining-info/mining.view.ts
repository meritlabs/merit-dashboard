import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from '@dashboard/common/reducers/app.reducer';
import { Observable } from 'rxjs/Observable';
import { IRanks } from '@dashboard/common/models/ranks';

@Component({
  selector: 'app-mining-view',
  templateUrl: './mining.view.html',
  styleUrls: ['./mining.view.sass'],
})
export class MiningViewComponent implements OnInit {
  constructor(private store: Store<IAppState>) {}

  ranks$: Observable<IRanks> = this.store.select('ranks');
  ngOnInit() {}
}
