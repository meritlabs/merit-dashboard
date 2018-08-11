import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';

@Injectable()
export class DashboardAPI_Service {
  constructor(private http: HttpClient) {}
  getMiningHistoryInfo(amount?) {
    return this._doGetRequestDA(`mining-info?n=${amount}`);
  }
  getBlocksInfo(amount?, step?) {
    if (!amount) amount = 100;
    if (!step) step = ENV.nPowTargetTimeSpan;
    return this._doGetRequestDA(`blocks-info?blocks=${amount}&step=${step}`);
  }
  getReferrals(address, limit?) {
    if (!limit) limit = 1000;
    return this._doGetRequestDA(`address/${address}/nearby?nodes=${limit}`);
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
