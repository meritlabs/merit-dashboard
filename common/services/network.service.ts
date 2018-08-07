import { Injectable } from '@angular/core';
import { Node, INodes } from '../models/network';
import { DashboardAPI_Service } from '@dashboard/common/services/dashboard-api.service';
import { LoadNodes } from '@dashboard/common/actions/nodes.action';

@Injectable()
export class NetworkService {
  constructor(public dashboardApi: DashboardAPI_Service) {}

  async getNetwork(address) {
    let getReferrals = await this.dashboardApi.getReferrals(address);
    let network = [];
    let referrals = Array.prototype.slice.apply(getReferrals);

    network.push(new Node(`${address}`, `${address}`, 10000, `CORE(${address})`));
    referrals.map(item => {
      let weight = referrals.filter(wItem => wItem.parentAddress === item.address).length;
      network.push(new Node(`${item.address}`, `${item.parentAddress}`, weight, item.alias));
    });
    console.log(network);
    return network;
  }

  createSvg(select, size) {
    return select
      .append('svg')
      .attr('width', size[0])
      .attr('height', size[1]);
  }
}
