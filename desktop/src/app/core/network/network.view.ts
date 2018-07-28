import { Component, ElementRef, ViewChild } from '@angular/core';
import { NetworkService } from '@dashboard/common/services/network.service';
import * as d3_3 from 'd3-3';
import * as d3 from 'd3';

declare const window: any;
const D3 = Object.assign({}, d3, d3_3);

@Component({
  selector: 'app-network-view',
  templateUrl: './network.view.html',
  styleUrls: ['./network.view.sass'],
})
export class NetworkViewComponent {
  constructor(private networkService: NetworkService) {}
  @ViewChild('canvas') private canvas: ElementRef;

  arr = [];
  async ngAfterViewInit() {
    this.arr = await this.networkService.getNetwork(0);
    this.generateGraph();
  }

  generateGraph() {
    var _this = this;

    var nodes = {};

    this.arr.forEach(function(link) {
      link.source = nodes[link.source] || (nodes[link.source] = { name: link.label, size: link.weight });
      link.target = nodes[link.target] || (nodes[link.target] = { name: link.label, size: link.weight });
    });

    var width = window.innerWidth / 1.25,
      height = window.innerHeight / 1.25;

    var force = D3.layout
      .force()
      .nodes(D3.values(nodes))
      .links(this.arr)
      .size([width, height])
      .linkDistance(60)
      .charge(-300)
      .on('tick', tick)
      .start();

    var svg = D3.select(this.canvas.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    var link = svg
      .selectAll('.link')
      .data(force.links())
      .enter()
      .append('line')
      .attr('class', 'link');

    var node = svg
      .selectAll('.node')
      .data(force.nodes())
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(force.drag);

    node
      .append('circle')
      .attr('fill', '#fff')
      .attr('r', 15);

    node
      .append('circle')
      .attr('fill', 'rgb(0, 176, 221)')
      .attr('r', 5)
      .style('background', 'rgb(0, 176, 221)')
      .style('transform', 'translateX(-20px)');
    node
      .append('text')
      .attr('stroke', '#FFF')
      .style('transform', 'translate(-23px, 4px)')
      .style('font-size', '10px')
      .text(function(d) {
        return '+';
      });

    node
      .append('image')
      .attr('xlink:href', 'https://www.merit.me/images/favicon.ico')
      .attr('x', -8)
      .attr('y', -8)
      .attr('width', 16)
      .attr('height', 16);

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
    node.on('click', async function() {
      svg.remove();
      _this.arr = await _this.networkService.getNetwork(0);
      _this.generateGraph();
    });

    function tick() {
      link
        .attr('x1', function(d) {
          return d.source.x;
        })
        .attr('y1', function(d) {
          return d.source.y;
        })
        .attr('x2', function(d) {
          return d.target.x;
        })
        .attr('y2', function(d) {
          return d.target.y;
        });

      node.attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      });
    }
  }
}
