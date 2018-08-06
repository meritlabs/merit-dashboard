import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';

const mwsApiUrl = ENV.mwsApiUrl;

@Injectable()
export class RanksService {
  constructor(private http: HttpClient) {}
  public getRank(limit) {
    return this.http.get(`${mwsApiUrl}leaderboard`);
  }
}
