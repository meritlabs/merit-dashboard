import { Component, ElementRef, ViewChild } from '@angular/core';
import { NetworkService } from '@dashboard/common/services/network.service';
import { Store } from '@ngrx/store';
import { IAppState } from '@dashboard/common/reducers/app.reducer';
import { DashboardAPI_Service } from '@dashboard/common/services/dashboard-api.service';

declare const window: any;
declare const d3: any;
const D3 = d3;

@Component({
  selector: 'app-network-view',
  templateUrl: './network.view.html',
  styleUrls: ['./network.view.sass'],
})
export class NetworkViewComponent {
  constructor(
    private networkService: NetworkService,
    public dashboardApi: DashboardAPI_Service,
    private store: Store<IAppState>
  ) {}
  @ViewChild('canvas') private canvas: ElementRef;

  nodes$ = this.store.select('nodes');
  arr = [];
  genesisAddress;
  ngOnInit() {
    this.nodes$.subscribe(res => {
      if (res.nodes.length > 0) {
        this.arr = res.nodes;
        this.generateGraph();
      }
    });
  }

  generateGraph() {
    this.canvas.nativeElement.value = '';

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
    node = this.networkService.addPlusButton(node, this.store, this.networkService);

    var zoom = D3.behavior
      .zoom()
      .scaleExtent([1, 1.2])
      .on('zoom', zoomed);

    svg.call(zoom);
    function zoomed() {
      svg.attr('transition', 'all .3s linear');
      svg.attr('transform', 'translate(' + D3.event.translate + ')scale(' + D3.event.scale + ')');
    }

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
