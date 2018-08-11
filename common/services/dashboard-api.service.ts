import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
import { LoadNodes } from '@dashboard/common/actions/nodes.action';
import { Store } from '@ngrx/store';
import { IAppState } from '@dashboard/common/reducers/app.reducer';

@Injectable()
export class DashboardAPI_Service {
  constructor(private http: HttpClient, private store: Store<IAppState>) {}
  getMiningHistoryInfo(amount?) {
    return this._doGetRequestDA(`mining-info?n=${amount}`);
  }
  getBlocksInfo(amount?, step?) {
    if (!amount) amount = 100;
    if (!step) step = ENV.nPowTargetTimeSpan;
    return this._doGetRequestDA(`blocks-info?blocks=${amount}&step=${step}`);
  }
  async getReferrals(address, limit?) {
    if (!limit) limit = 1000;
    this.store.dispatch(new LoadNodes({ loading: true }));
    let gNodes = await this._doGetRequestDA(`address/${address}/nearby?nodes=${limit}`);
    this.store.dispatch(new LoadNodes({ loading: false }));
    return gNodes;
  }
  getAddressNetwork(address) {
    return this._doGetRequestDA(`address/${address}/referrals`);
  }
  getMiningInfo(step?, amount?) {
    if (!amount) amount = 30;
    if (!step) step = ENV.nPowTargetTimeSpan;
    return this._doGetRequestDA(`mininginfo?step=${step}&n=${amount}`);
  }
  getLeaderBoard() {
    return this._doGetRequestDA('leaderboard');
  }
  getAddressRank(address) {
    return this._doGetRequestDA(`rank/${address}`);
  }
  getAddressANV(address) {
    return this._doGetRequestDA(`anv/${address}`);
  }
  getAddressRewards(address) {
    return this._doGetRequestDA(`rewards/${address}`);
  }
  getAddressBalance(address) {
    return this._doGetRequestDA(`balance/${address}`);
  }
  getBestBlockHash() {
    return this._doGetRequestDA(`bestblockhash`);
  }
  getBestBlock() {
    return this._doGetRequestDA(`bestblock`);
  }
  getBlock(hash) {
    return this._doGetRequestDA(`block/${hash}`);
  }
  validateAddress(address) {
    return this._doGetRequestMWS(`addresses/${address}/validate`);
  }
  _doGetRequestDA(path) {
    return this.http.get(ENV.dashboardApi + path).toPromise();
  }
  _doGetRequestMWS(path) {
    return this.http.get(ENV.mwsApiUrl + path).toPromise();
  }
}
