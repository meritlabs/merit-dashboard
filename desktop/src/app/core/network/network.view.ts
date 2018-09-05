import { Component, ElementRef, ViewChild } from '@angular/core';
import { NetworkService } from '@dashboard/common/services/network.service';
import { Store } from '@ngrx/store';
import { IAppState } from '@dashboard/common/reducers/app.reducer';
import { DashboardAPI_Service } from '@dashboard/common/services/dashboard-api.service';
import { INode } from '@dashboard/common/models/network';
import { LoadNodes } from '@dashboard/common/actions/nodes.action';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ENV } from '@app/env';
import * as d3 from 'd3v4';

declare const window: any;
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
    private store: Store<IAppState>,
    private formBuilder: FormBuilder
  ) {}
  @ViewChild('canvas')
  private canvas: ElementRef;

  nodes$ = this.store.select('nodes');
  graphData = {};
  genesisAddress;
  isLabelEnable: boolean;
  gNodes: INode[] = [];
  breadCrumbs = [];
  formData: FormGroup = this.formBuilder.group({
    address: '',
  });
  wallets: any;
  walletsDisplay: any = { totalDisplay: 0, monthDisplay: 0, weekDisplay: 0 };
  selectedAddress: string = ENV.coreAddress;
  selectedMapSize: number = 500;
  selectionList = [500, 1000, 1500, 2000];
  showWarning: boolean;
  isFullScreen: boolean;
  showList: boolean;
  zoomLvl: any;

  async ngOnInit() {
    this.wallets = Object.assign(this.walletsDisplay, await this.dashboardApi.getWalletsAmount());

    this.loadGraph();
    this.nodes$.subscribe(res => {
      if (res.nodes.length > 0) {
        this.graphData = res.nodes;
        this.generateGraph();
      }
    });
    this.displayAddressesCount();
  }

  async getAddressDetails(address) {
    let getAddress = (await this.dashboardApi.validateAddress(address)) as any;
    return getAddress.alias || 'Anonymous';
  }
  async validateAddress(address) {
    let getAddress: any = (await this.dashboardApi.validateAddress(address)) as any;
    let isValid: any = getAddress.isValid;
    let validAddress;
    if (isValid) {
      validAddress = getAddress.address;
      this.selectedAddress = validAddress;
      this.loadGraph(validAddress);
    } else {
      console.error('Address not found!');
    }
  }

  loadNodes() {
    this.store.dispatch(new LoadNodes({ nodes: this.gNodes } as any));
    this.showWarning = false;
  }

  async backToParent(item) {
    let gNodes = await this.networkService.getNetwork(item.address);
    let index = this.breadCrumbs.indexOf(item);

    this.store.dispatch(new LoadNodes({ nodes: gNodes }));
    this.selectedAddress = item;
    if (index > -1) {
      this.breadCrumbs.length = index + 1;
    }
  }

  async loadGraph(address?, amount?) {
    if (amount) this.selectedMapSize = amount;

    this.gNodes = await this.networkService.getNetwork(address || this.selectedAddress, amount || this.selectedMapSize);

    if (this.gNodes.length > 1000) {
      this.showWarning = true;
    } else {
      this.store.dispatch(new LoadNodes({ nodes: this.gNodes }));
    }
  }

  generateGraph() {
    D3.select('canvas').remove();
    let height = window.innerHeight;
    let graphWidth = window.innerWidth;
    let tempData = {
      nodes: this.graphData as Array<INode>,
      edges: this.graphData as Array<INode>,
    };

    let graphCanvas = d3
      .select(this.canvas.nativeElement)
      .append('canvas')
      .attr('width', graphWidth + 'px')
      .attr('height', height + 'px')
      .node();

    let context = graphCanvas.getContext('2d');

    let simulation = d3
      .forceSimulation()
      .force('center', d3.forceCenter(graphWidth / 2, height / 2))
      .force('x', d3.forceX(graphWidth / 2).strength(0.5))
      .force('y', d3.forceY(height / 2).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-600))
      .force(
        'link',
        d3
          .forceLink()
          .strength(0.2)
          .id(function(d) {
            return d.source;
          })
      )
      .alphaTarget(0)
      .alphaDecay(0.05);

    let transform = d3.zoomIdentity;

    function zoomed() {
      transform = d3.event.transform;
      simulationUpdate();
    }

    d3.select(graphCanvas)
      // .call(
      //   d3
      //     .drag()
      //     .subject(dragsubject)
      //     .on('start', dragstarted)
      //     .on('drag', dragged)
      //     .on('end', dragended)
      // )
      .call(
        d3
          .zoom()
          .scaleExtent([1 / 10, 8])
          .on('zoom', zoomed)
      );

    simulation.nodes(tempData.nodes).on('tick', simulationUpdate);

    simulation.force('link').links(tempData.edges);

    function simulationUpdate() {
      context.save();

      context.clearRect(0, 0, graphWidth, height);
      context.translate(transform.x, transform.y);
      context.scale(transform.k, transform.k);

      tempData.edges.map(item => {
        let edge = item as any;
        context.beginPath();
        context.moveTo(edge.source.x, edge.source.y);
        context.lineTo(edge.target.x, edge.target.y);
        context.strokeStyle = '#FFF';
        context.stroke();
      });

      // Draw the nodes
      tempData.nodes.map(d => {
        let node = d as any;
        let radius = 10;
        if (node.weight > 0 && node.weight < 15) {
          radius += node.weight;
        }
        if (node.weight > 15 && node.weight < 30) {
          radius = node.weight;
          node.col = '#f9bd60';
        }

        if (node.weight > 30) {
          radius = 40;
          node.col = '#f9d360';
        }

        context.beginPath();
        context.arc(node.x, node.y, radius, 0, 2 * Math.PI, true);
        context.fillStyle = node.col ? node.col : 'white';
        context.fill();
        context.fillStyle = '#08d0ff';
        context.shadowBlur = 10;
        context.shadowColor = 'rgba(0,0,0,0.3)';
        context.fillText(node.label, node.x + 5, node.y + 5);
      });

      context.restore();

      // function dragsubject() {
      //   var i,
      //     x = transform.invertX(d3.event.x),
      //     y = transform.invertY(d3.event.y),
      //     dx,
      //     dy;
      //   for (i = tempData.nodes.length - 1; i >= 0; --i) {
      //     let node = tempData.nodes[i];
      //     dx = x - node.x;
      //     dy = y - node.y;

      //     if (dx * dx + dy * dy < radius * radius) {
      //       node.x = transform.applyX(node.x);
      //       node.y = transform.applyY(node.y);

      //       return node;
      //     }
      //   }
      // }

      // function dragstarted() {
      //   if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      //   d3.event.subject.fx = transform.invertX(d3.event.x);
      //   d3.event.subject.fy = transform.invertY(d3.event.y);
      // }

      // function dragged() {
      //   d3.event.subject.fx = transform.invertX(d3.event.x);
      //   d3.event.subject.fy = transform.invertY(d3.event.y);
      // }

      // function dragended() {
      //   if (!d3.event.active) simulation.alphaTarget(0);
      //   d3.event.subject.fx = null;
      //   d3.event.subject.fy = null;
      // }
    }
  }

  displayAddressesCount() {
    let total = setInterval(() => {
      if (this.wallets.totalDisplay <= this.wallets.total) {
        let inc = this.wallets.total / 10;
        this.wallets.totalDisplay += inc;
      } else {
        clearInterval(total);
        this.selectionList.push(this.wallets.totalDisplay.toFixed(0));
      }
    }, 100);
    let thisMont = setInterval(() => {
      if (this.wallets.monthDisplay <= this.wallets.month) {
        let inc = this.wallets.month / 10;
        this.wallets.monthDisplay += inc;
      } else {
        clearInterval(thisMont);
      }
    }, 100);
    let thisWeek = setInterval(() => {
      if (this.wallets.weekDisplay <= this.wallets.week) {
        let inc = this.wallets.week / 10;
        this.wallets.weekDisplay += inc;
      } else {
        clearInterval(thisWeek);
      }
    }, 100);
  }
}
