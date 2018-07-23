import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const mwsApiUrl = environment.mwsApiUrl;

@Injectable()
export class RanksService {
  constructor(private http: HttpClient) {}
  public getRank(limit) {
    return this.http.get(`${mwsApiUrl}community/leaderboard?limit=${limit}`);
  }
}
