import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';

@Injectable()
export class DashboardAPI_Service {
  constructor(private http: HttpClient) {}
  getMiningHistoryInfo() {
    return this._doGetRequestDA('mining-info');
  }
  getBlocksInfo() {
    return this._doGetRequestDA('blocks-info');
  }
  getReferrals(address) {
    return this._doGetRequestDA(`address/${address}/nearby?nodes=300`);
  }
  getMiningInfo() {
    return this._doGetRequestDA('mininginfo');
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
