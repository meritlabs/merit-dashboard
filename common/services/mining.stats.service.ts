import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
import { Node } from '@dashboard/common/models/network';

const mwsApiUrl = ENV.mwsApiUrl;

@Injectable()
export default class MiningService {
  constructor(private http: HttpClient) {}
  getMiningStats() {
    return this._doGetRequest('mining-info');
  }
  _doGetRequest(path) {
    return this.http.get(mwsApiUrl + path).toPromise();
  }
}
