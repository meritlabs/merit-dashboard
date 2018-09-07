import { Component, ElementRef, ViewChild } from '@angular/core';
import { NetworkService } from '@dashboard/common/services/network.service';
import { Store } from '@ngrx/store';
import { IAppState } from '@dashboard/common/reducers/app.reducer';
import { DashboardAPI_Service } from '@dashboard/common/services/dashboard-api.service';
import { INode, INodes } from '@dashboard/common/models/network';
import { LoadNodes } from '@dashboard/common/actions/nodes.action';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  genesisAddress = ENV.coreAddress;
  isLabelEnable: boolean;
  gNodes: INode[] = [];
  formData: FormGroup = this.formBuilder.group({
    address: ['', [Validators.required]],
  });
  wallets: any;
  walletsDisplay: any = { totalDisplay: 0, monthDisplay: 0, weekDisplay: 0 };
  selectedAddress: string = ENV.coreAddress;
  selectedMapSize: number = 500;
  selectionList = [500, 1000, 1500, 2000];
  showWarning: boolean;
  isFullScreen: boolean;
  showList: boolean;

  async ngOnInit() {
    this.nodes$.subscribe(res => {
      this.wallets = Object.assign(this.walletsDisplay, res.wallets);
      if (res.nodes && res.nodes.length > 0) {
        if (res.toDisplay === this.selectedMapSize) {
          this.selectedMapSize = res.toDisplay;
        }
        this.graphData = res.nodes;
        this.generateGraph();
        this.displayAddressesCount();
      }
    });
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
      this.loadGraph({ address: validAddress, alias: getAddress.alias });
    } else {
      // (this.formData.controls.address as any).status = 'INVALID';
      this.formData.controls['address'].setErrors({ invalid: true });
    }
  }

  loadNodes() {
    this.store.dispatch(
      new LoadNodes({
        selectedAddress: this.selectedAddress,
        toDisplay: this.selectedMapSize,
        nodes: this.gNodes,
      })
    );
    this.showWarning = false;
  }

  async loadGraph(core?, amount?) {
    if (amount) this.selectedMapSize = amount;
    if (!core) core = { address: this.selectedAddress, alias: '' };

    this.gNodes = await this.networkService.getNetwork(core, amount || this.selectedMapSize);

    if (this.gNodes.length > 10000) {
      this.showWarning = true;
    } else {
      this.store.dispatch(
        new LoadNodes({ selectedAddress: core.address, toDisplay: amount || this.selectedMapSize, nodes: this.gNodes })
      );
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
    let link = d3
      .forceLink()
      .strength(0.6)
      .id(function(d) {
        return d.source;
      });
    let simulation = d3
      .forceSimulation()
      .force('center', d3.forceCenter(graphWidth / 2, height / 2))
      .force('x', d3.forceX(graphWidth / 2).strength(0.5))
      .force('y', d3.forceY(height / 2).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-700))
      .force('link', link)
      .alphaTarget(0)
      .alphaDecay(0.04);
    let transform = d3.zoomIdentity;
    let _zoom = d3
      .zoom()
      .scaleExtent([0, 4])
      .on('zoom', zoomed);
    let _drag = d3
      .drag()
      .subject(dragSubject)
      .on('start', dragStarted)
      .on('drag', dragged)
      .on('end', dragended);

    d3.select(graphCanvas)
      .call(_drag)
      .call(_zoom);
    d3.selectAll('button.zoom.ui-button.ui-button--white.in').on('click', function() {
      _zoom.scaleBy(d3.select(graphCanvas), 4);
    });
    d3.selectAll('button.zoom.ui-button.ui-button--white.out').on('click', function() {
      _zoom.scaleBy(d3.select(graphCanvas), 0.5);
    });

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
        context.strokeStyle = '#c8cbce';
        context.stroke();
      });

      // Draw the nodes
      tempData.nodes.map(d => {
        let node = d as any;
        let radius = 4;
        let titleColor = '#17dcd1';
        if (node.weight > 0) titleColor = '#f91f4f';

        if (node.weight > 0 && node.weight < 15) {
          radius = 10 + node.weight;
          node.col = '#ffdc00';
        }
        if (node.weight > 15 && node.weight < 30) {
          radius = node.weight;
          node.col = '#ffd10f';
        }

        if (node.weight > 30) {
          radius = 40;
          node.col = '#ffbe00';
        }

        context.beginPath();
        context.arc(node.x, node.y, radius, 0, 2 * Math.PI, true);
        context.fillStyle = node.col ? node.col : 'white';
        context.fill();
        context.fillStyle = titleColor;
        context.font = 'normal small-caps bold 12px Arial';
        context.fillText(node.label, node.x, node.y - 1);
      });

      context.restore();
    }
    function dragSubject() {
      var i,
        x = transform.invertX(d3.event.x),
        y = transform.invertY(d3.event.y),
        dx,
        dy;
      for (i = tempData.nodes.length - 1; i >= 0; --i) {
        let node = tempData.nodes[i] as any;
        let radius = 15;
        dx = x - node.x;
        dy = y - node.y;

        if (dx * dx + dy * dy < radius * radius) {
          node.x = transform.applyX(node.x);
          node.y = transform.applyY(node.y);
          return node;
        }
      }
    }

    function dragStarted() {
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

    function zoomed() {
      transform = d3.event.transform;
      simulationUpdate();
    }
  }

  displayAddressesCount() {
    let total = setInterval(() => {
      if (this.wallets.totalDisplay < this.wallets.total) {
        let inc = this.wallets.total / 10;
        this.wallets.totalDisplay += inc;
      } else {
        clearInterval(total);
        this.selectionList.push(this.wallets.totalDisplay.toFixed(0));
      }
    }, 100);
    let thisMont = setInterval(() => {
      if (this.wallets.monthDisplay < this.wallets.month) {
        let inc = this.wallets.month / 10;
        this.wallets.monthDisplay += inc;
      } else {
        clearInterval(thisMont);
      }
    }, 100);
    let thisWeek = setInterval(() => {
      if (this.wallets.weekDisplay < this.wallets.week) {
        let inc = this.wallets.week / 10;
        this.wallets.weekDisplay += inc;
      } else {
        clearInterval(thisWeek);
      }
    }, 100);
  }
}
