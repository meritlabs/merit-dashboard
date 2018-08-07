import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';

const mwsApiUrl = ENV.mwsApiUrl;

@Injectable()
export class DashboardAPI_Service {
  constructor(private http: HttpClient) {}
  getMiningHistoryInfo() {
    return this._doGetRequest('mining-info');
  }
  getBlocksInfo() {
    return this._doGetRequest('blocks-info');
  }
  getReferrals(address) {
    return this._doGetRequest(`address/${address}/nearby?nodes=10`);
  }
  getMiningInfo() {
    return this._doGetRequest('mininginfo');
  }
  getLeaderBoard() {
    return this._doGetRequest('leaderboard');
  }
  getAddressRank(address) {
    return this._doGetRequest(`rank/${address}`);
  }
  getAddressANV(address) {
    return this._doGetRequest(`anv/${address}`);
  }
  getAddressRewards(address) {
    return this._doGetRequest(`rewards/${address}`);
  }
  getAddressBalance(address) {
    return this._doGetRequest(`balance/${address}`);
  }
  getBestBlockHash() {
    return this._doGetRequest(`bestblockhash`);
  }
  getBestBlock() {
    return this._doGetRequest(`bestblock`);
  }
  getBlock(hash) {
    return this._doGetRequest(`block/${hash}`);
  }
  _doGetRequest(path) {
    return this.http.get(mwsApiUrl + path).toPromise();
  }
}
