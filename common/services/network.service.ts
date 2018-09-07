import { Injectable } from '@angular/core';
import { Node, INodes } from '../models/network';
import { DashboardAPI_Service } from '@dashboard/common/services/dashboard-api.service';

@Injectable()
export class NetworkService {
  constructor(public dashboardApi: DashboardAPI_Service) {}

  async getNetwork(core, limit?) {
    let address = core.address;
    let getReferrals = await this.dashboardApi.getReferrals(address, limit);
    let network = [];
    let referrals = Array.prototype.slice.apply(getReferrals);
    network.push(new Node(`${address}`, `${address}`, limit, `ROOT (${core.alias || 'Anonymous'})`, limit));
    referrals.map(item => {
      let weight = referrals.filter(wItem => wItem.parentAddress === item.address).length;
      network.push(new Node(`${item.address}`, `${item.parentAddress}`, weight, item.alias, item.childNodes));
    });
    return network;
  }
}
