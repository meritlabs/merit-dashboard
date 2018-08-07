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
    let nodes_data = this.arr.map(item => ({ name: item.source, label: item.label }));
    let links_data = this.arr.map(item => ({ source: item.source, target: item.target }));
    let width = window.innerWidth / 1.25;
    let height = window.innerHeight / 1.25;
    let select = D3.select(this.canvas.nativeElement);
    let size = [width, height];
    let svg = this.networkService.createSvg(select, size);
    let simulation = d3.forceSimulation().nodes(nodes_data);
    let link_force = d3.forceLink(links_data).id(function(d) {
      return d.name;
    });
    let charge_force = d3.forceManyBody().strength(-5);
    let center_force = d3.forceCenter(width / 2, height / 2);

    simulation
      .force('charge_force', charge_force)
      .force('center_force', center_force)
      .force('links', link_force);

    //add tick instructions:
    simulation.on('tick', tickActions);

    //add encompassing group for the zoom
    let g = svg.append('g').attr('class', 'everything');

    //draw lines for the links
    let link = g
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links_data)
      .enter()
      .append('line')
      .attr('stroke-width', 1)
      .style('stroke', '#FFF');

    //draw circles for the nodes
    let node = g
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes_data)
      .enter()
      .append('g')
      .attr('fill', '#FFF');

    //add drag capabilities
    let drag_handler = d3
      .drag()
      .on('start', drag_start)
      .on('drag', drag_drag)
      .on('end', drag_end);

    drag_handler(node);

    //add zoom capabilities
    let zoom_handler = d3.zoom().on('zoom', zoom_actions);

    zoom_handler(svg);

    //Drag functions
    //d is the node
    function drag_start(d) {
      if (!d3.event.active) simulation.alphaTarget(0.1).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    //make sure you can't drag the circle outside the box
    function drag_drag(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function drag_end(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    //Zoom functions
    function zoom_actions() {
      let zoomLvl = d3.event.transform;
      if (zoomLvl.k > 2) {
        node
          .append('text')
          .attr('x', 0)
          .attr('dy', 0)
          .attr('fill', 'rgb(0, 176, 221)')
          .style('font-size', '5px')
          .text(function(d) {
            return d.label;
          });
        charge_force = d3.forceManyBody().strength(-200);
        center_force = d3.forceCenter(width / 2, height / 2);

        simulation
          .force('charge_force', charge_force)
          .force('center_force', center_force)
          .force('links', link_force);
      } else {
        node.selectAll('text').remove();
      }
      g.attr('transform', zoomLvl);
    }

    function tickActions() {
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
