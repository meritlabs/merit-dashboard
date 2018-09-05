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
declare const document: any;
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
  selectionList = [500, 1000, 1500, 2000, 'FULL NETWORK'];
  showWarning: boolean;
  isGraphBuilded: boolean;
  isFullScreen: boolean;
  showList: boolean;
  zoomLvl: any;

  async ngOnInit() {
    this.wallets = Object.assign(this.walletsDisplay, await this.dashboardApi.getWalletsAmount());

    this.loadGraph();
    this.nodes$.subscribe(res => {
      if (res.nodes.length > 0) {
        this.graphData = res.nodes;
        console.log(res.nodes);

        let source = this.graphData[0].source;
        let isDuplicate = this.breadCrumbs.find(item => item.address === source);
        if (!isDuplicate) {
          (async () => {
            this.breadCrumbs.push({ name: await this.getAddressDetails(source), address: source });
          })();
        }
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
    }
    this.loadGraph(validAddress);
  }

  displayAddressesCount() {
    let total = setInterval(() => {
      if (this.wallets.totalDisplay <= this.wallets.total) {
        this.wallets.totalDisplay += 1234;
      } else {
        clearInterval(total);
      }
    }, 100);
    let thisMont = setInterval(() => {
      if (this.wallets.monthDisplay <= this.wallets.month) {
        this.wallets.monthDisplay += 100;
      } else {
        clearInterval(thisMont);
      }
    }, 100);
    let thisWeek = setInterval(() => {
      if (this.wallets.weekDisplay <= this.wallets.week) {
        this.wallets.weekDisplay += 13;
      } else {
        clearInterval(thisWeek);
      }
    }, 100);
  }

  loadNodes() {
    this.store.dispatch(new LoadNodes({ nodes: this.gNodes } as any));
    this.showWarning = false;
  }
  async backToParent(item) {
    let gNodes = await this.networkService.getNetwork(item.address);
    this.store.dispatch(new LoadNodes({ nodes: gNodes }));
    var index = this.breadCrumbs.indexOf(item);
    this.selectedAddress = item;
    if (index > -1) {
      this.breadCrumbs.length = index + 1;
    }
  }

  async loadGraph(address?, amount?) {
    if (!amount) amount = this.selectedMapSize;
    if (amount === 'FULL NETWORK') amount = this.wallets.total;
    if (amount) this.selectedMapSize = amount;
    if (this.selectedMapSize) amount = this.selectedMapSize;
    if (!address) address = this.selectedAddress;

    this.gNodes = await this.networkService.getNetwork(this.selectedAddress, this.selectedMapSize);

    if (this.gNodes.length > 1000) {
      this.showWarning = true;
    } else {
      this.store.dispatch(new LoadNodes({ nodes: this.gNodes }));
    }
  }

  enterFullScreen() {
    this.isFullScreen = !this.isFullScreen;
    this.isGraphBuilded = false;
    setTimeout(() => {
      this.generateGraph();
    }, 200);
  }
  generateGraph() {
    this.isGraphBuilded = true;

    var radius = 5;

    var defaultNodeCol = 'white',
      highlightCol = 'yellow';

    var height = window.innerHeight;
    var graphWidth = window.innerWidth;
    let tempData = {
      nodes: this.graphData,
      edges: this.graphData,
    };
    console.log(tempData);

    var graphCanvas = d3
      .select(this.canvas.nativeElement)
      .append('canvas')
      .attr('width', graphWidth + 'px')
      .attr('height', height + 'px')
      .node();

    var context = graphCanvas.getContext('2d');

    var div = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    var simulation = d3
      .forceSimulation()
      .force('center', d3.forceCenter(graphWidth / 2, height / 2))
      .force('x', d3.forceX(graphWidth / 2).strength(0.1))
      .force('y', d3.forceY(height / 2).strength(0.1))
      .force('charge', d3.forceManyBody().strength(-50))
      .force(
        'link',
        d3
          .forceLink()
          .strength(1)
          .id(function(d) {
            return d.source;
          })
      )
      .alphaTarget(0)
      .alphaDecay(0.05);

    var transform = d3.zoomIdentity;

    function zoomed() {
      console.log('zooming');
      transform = d3.event.transform;
      simulationUpdate();
    }

    d3.select(graphCanvas)
      .call(
        d3
          .drag()
          .subject(dragsubject)
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      )
      .call(
        d3
          .zoom()
          .scaleExtent([1 / 10, 8])
          .on('zoom', zoomed)
      );

    function dragsubject() {
      var i,
        x = transform.invertX(d3.event.x),
        y = transform.invertY(d3.event.y),
        dx,
        dy;
      for (i = tempData.nodes.length - 1; i >= 0; --i) {
        let node = tempData.nodes[i];
        dx = x - node.x;
        dy = y - node.y;

        if (dx * dx + dy * dy < radius * radius) {
          node.x = transform.applyX(node.x);
          node.y = transform.applyY(node.y);

          return node;
        }
      }
    }

    function dragstarted() {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d3.event.subject.fx = transform.invertX(d3.event.x);
      d3.event.subject.fy = transform.invertY(d3.event.y);
    }

    function dragged() {
      d3.event.subject.fx = transform.invertX(d3.event.x);
      d3.event.subject.fy = transform.invertY(d3.event.y);
    }

    function dragended() {
      if (!d3.event.active) simulation.alphaTarget(0);
      d3.event.subject.fx = null;
      d3.event.subject.fy = null;
    }

    simulation.nodes(tempData.nodes).on('tick', simulationUpdate);

    simulation.force('link').links(tempData.edges);

    function render() {}

    function simulationUpdate() {
      context.save();

      context.clearRect(0, 0, graphWidth, height);
      context.translate(transform.x, transform.y);
      context.scale(transform.k, transform.k);

      tempData.edges.forEach(function(d) {
        context.beginPath();
        context.moveTo(d.source.x, d.source.y);
        context.lineTo(d.target.x, d.target.y);
        context.stroke();
      });

      // Draw the nodes
      tempData.nodes.forEach(function(d, i) {
        context.beginPath();
        context.arc(d.x, d.y, radius, 0, 2 * Math.PI, true);
        context.fillStyle = d.col ? 'red' : 'black';
        context.fill();
      });

      context.restore();
      //transform = d3.zoomIdentity;
    }
  }
}
