import { Injectable } from '@angular/core';
import { Node } from '../models/network';
import { DashboardAPI_Service } from '@dashboard/common/services/dashboard-api.service';

@Injectable()
export class NetworkService {
  constructor(public dashboardApi: DashboardAPI_Service) {}

  async getNetwork(core, limit?) {
    let address = core.address;
    let getReferrals = await this.dashboardApi.getReferrals(address, limit);
    let referrals = Array.prototype.slice.apply(getReferrals);
    const root = new Node(`${address}`, `${address}`, limit, `CORE (${core.alias || 'Anonymous'})`, limit);

    const childNodes = referrals.map(r => {
      const weight = referrals.filter(wItem => wItem.parentAddress === r.address).length;

      return new Node(`${r.address}`, `${r.parentAddress}`, weight, r.alias, r.childNodes);
    });

    return [root, ...childNodes];
  }
}
