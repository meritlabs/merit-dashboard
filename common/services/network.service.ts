import { Injectable } from '@angular/core';
import { Node, INodes } from '../models/network';
import { DashboardAPI_Service } from '@dashboard/common/services/dashboard-api.service';

@Injectable()
export class NetworkService {
  constructor(public dashboardApi: DashboardAPI_Service) {}

  async getNetwork(address, limit?) {
    let getReferrals = await this.dashboardApi.getReferrals(address, limit);
    let network = [];
    let referrals = Array.prototype.slice.apply(getReferrals);

    console.log(referrals);

    network.push(new Node(`${address}`, `${address}`, 10000, `CORE(${address})`));
    referrals.map(item => {
      let weight = referrals.filter(wItem => wItem.parentAddress === item.address).length;
      network.push(new Node(`${item.address}`, `${item.parentAddress}`, weight, item.alias));
    });
    return network;
  }

  createSvg(select, size) {
    return select
      .append('svg')
      .attr('width', size[0])
      .attr('height', size[1]);
  }
}
