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
  async ngOnInit() {
    this.arr = await this.networkService.getNetwork(0);
    this.generateGraph();
  }

  generateGraph() {
    let _this = this;
    let array = this.arr;
    let width = window.innerWidth / 1.25;
    let height = window.innerHeight / 1.25;
    let layout = D3.layout;
    let nodes = this.networkService.createNodes(array);
    let select = D3.select(this.canvas.nativeElement);
    let size = [width, height];
    let svg = this.networkService.createSvg(select, size);
    let values = D3.values(nodes);
    let force = this.networkService.createForce(layout, array, values, size, tick);
    let link = this.networkService.createLink(svg, force.links());
    let node = this.networkService.createNode(svg, force.nodes());

    node.call(force.drag);
    node = this.networkService.drawMainCircle(node);
    node = this.networkService.addNodeTitle(node);
    node = this.networkService.addPlusButton(node);

    node.on('click', async function() {
      // console.log(this);
      // svg.remove();
      // _this.arr = await _this.networkService.getNetwork(0);
      // _this.generateGraph();
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
