import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
import { Node } from '@dashboard/common/models/network';

const mwsApiUrl = ENV.mwsApiUrl;

@Injectable()
export class NetworkService {
  constructor(private http: HttpClient) {}
  async getNetwork(from) {
    let resp = await this.http.get(`${mwsApiUrl}community/leaderboard?limit=100`).toPromise();
    let ranks = (resp as any).ranks;
    let network = [];
    ranks.forEach(item => {
      let node;
      if (item.rank === 1) {
        node = new Node(`${item.rank}`, `${item.rank}`, `${item.rank}`, item.alias);
      } else {
        node = new Node(`${item.rank}`, `${this.getRandomIntInclusive()}`, `${item.rank}`, item.alias);
      }
      network.push(node);
    });
    return network;
  }
  private getRandomIntInclusive() {
    let min = 0;
    let max = 100;
    return Math.floor(Math.random() * (max - min + 1)) + min; //Включаючи мінімум та максимум
  }
}
