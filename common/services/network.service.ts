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

    referrals.map(item => {
      network.push(new Node(`${address}`, `${item.address}`, `${item.address}`, item.alias));
    });
    return network;
  }

  createNodes(arr) {
    let nodes = {};
    arr.map(function(link) {
      link.source = nodes[link.source] || (nodes[link.source] = { name: link.label, size: link.weight });
      link.target = nodes[link.target] || (nodes[link.target] = { name: link.label, size: link.weight });
    });
    return nodes;
  }

  createForce(layout, links, nodes, size, tick) {
    return layout
      .force()
      .nodes(nodes)
      .links(links)
      .size(size)
      .linkDistance(100)
      .charge(-1000)
      .on('tick', tick)
      .start();
  }

  createSvg(select, size) {
    return select
      .append('svg')
      .attr('width', size[0])
      .attr('height', size[1]);
  }

  createLink(svg, data) {
    return svg
      .selectAll('.link')
      .data(data)
      .enter()
      .append('line')
      .attr('class', 'link');
  }

  createNode(svg, nodes) {
    return svg
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node');
  }

  drawMainCircle(node) {
    node
      .append('circle')
      .attr('fill', '#fff')
      .attr('r', 15);

    node
      .append('image')
      .attr('xlink:href', 'https://www.merit.me/images/favicon.ico')
      .attr('x', -8)
      .attr('y', -8)
      .attr('width', 16)
      .attr('height', 16);
    return node;
  }

  addNodeTitle(node) {
    node
      .append('text')
      .attr('x', 12)
      .attr('dy', 20)
      .attr('fill', 'rgb(0, 176, 221)')
      .attr('stroke', 'rgb(0, 176, 221)')
      .style('font-size', '11px')
      .text(function(d) {
        return d.name;
      });
    return node;
  }

  addPlusButton(node, store, networkService) {
    node
      .append('circle')
      .attr('fill', 'rgb(0, 176, 221)')
      .attr('r', 5)
      .style('background', 'rgb(0, 176, 221)')
      .style('transform', 'translateX(-20px)')
      .on('click', async function(ev) {
        let gNodes = await networkService.getNetwork('MGgAma9epMrSipSm9Y2YjCWGGSt7gJWzM7');
        console.log(gNodes);
        store.dispatch(new LoadNodes({ loading: false, nodes: gNodes } as INodes));
      });

    node
      .append('text')
      .attr('stroke', '#FFF')
      .style('transform', 'translate(-23px, 4px)')
      .style('font-size', '10px')
      .text(function(d) {
        return '+';
      });
    return node;
  }
}
