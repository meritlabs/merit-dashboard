import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

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
  @ViewChild('canvas') private canvas: ElementRef;

  ngAfterViewInit() {
    console.log(D3);
    this.generateGraph();
  }
  // this.canvas.nativeElement
  generateGraph() {
    var links = [
      { source: 'Genesys', target: 'Genesys', type: '' },
      { source: 'Genesys', target: 'Adil', type: '' },
      { source: 'Adil', target: 'AdilW1', type: '' },
      { source: 'Adil', target: 'AdilW2', type: '' },
      { source: 'Adil', target: 'AdilW3', type: '' },
      { source: 'Adil', target: 'AdilW4', type: '' },
      { source: 'Adil', target: 'AdilW5', type: '' },
      { source: 'AdilW5', target: 'AdilW21', type: '' },
      { source: 'AdilW5', target: 'AdilW22', type: '' },
      { source: 'AdilW5', target: 'AdilW23', type: '' },
      { source: 'AdilW5', target: 'AdilW24', type: '' },
      { source: 'AdilW5', target: 'AdilW25', type: '' },
      { source: 'AdilW5', target: 'AdilW26', type: '' },
      { source: 'AdilW5', target: 'AdilW27', type: '' },
    ];

    var nodes = {};

    // Compute the distinct nodes from the links.
    links.forEach(function(link) {
      link.source = nodes[link.source] || (nodes[link.source] = { name: link.source });
      link.target = nodes[link.target] || (nodes[link.target] = { name: link.target });
    });

    var width = window.innerWidth / 1.25,
      height = window.innerHeight / 1.25;

    var force = D3.layout
      .force()
      .nodes(D3.values(nodes))
      .links(links)
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
      .on('mouseover', mouseover)
      .on('mouseout', mouseout)
      .call(force.drag);

    node
      .append('circle')
      .attr('fill', '#fff')
      .attr('r', 12);

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
    node.on('click', function() {
      console.log(this);
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

    function mouseover() {
      D3.select(this)
        .select('circle')
        .transition()
        .duration(750)
        .attr('r', 12);
    }

    function mouseout() {
      D3.select(this)
        .select('circle')
        .transition()
        .duration(750)
        .attr('r', 12);
    }
  }
}
