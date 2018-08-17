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
  arr = [];
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
        this.arr = res.nodes;
        let source = this.arr[0].source;
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
    this.isGraphBuilded = false;
    this.zoomLvl = {
      k: 1,
      x: 0,
      y: 0,
    };
    D3.select('svg').remove();
    let _this = this;
    let nodes_data = this.arr.map(item => ({
      name: item.source,
      label: item.label,
      weight: item.weight,
      childNodes: item.childNodes,
    }));
    let links_data = this.arr.map(item => ({ source: item.source, target: item.target }));
    let width = this.canvas.nativeElement.offsetWidth;
    let height = this.canvas.nativeElement.offsetHeight;
    if (this.isFullScreen) {
      width = window.innerWidth;
      height = window.innerHeight;
    }
    let select = D3.select(this.canvas.nativeElement);
    let size = [width, height];

    let svg = this.networkService.createSvg(select, size);
    let simulation = d3.forceSimulation().nodes(nodes_data);
    let link_force = d3.forceLink(links_data).id(function(d) {
      return d.name;
    });
    let charge_force = d3
      .forceManyBody()
      .distanceMax(-150)
      .strength(-400);

    let center_force = d3.forceCenter(width / 2, height / 2);

    simulation
      .force('charge_force', charge_force)
      .force('center_force', center_force)
      .force('links', link_force);

    //add tick instructions:
    simulation.on('end', tickActions);

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
      .style('stroke', '#c8c7cc');

    //draw circles for the nodes
    let node = g
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes_data)
      .enter()
      .append('g')
      .attr('fill', '#c8c7cc');

    node
      .append('circle')
      .attr('fill', '#c8c7cc')
      .attr('r', function(d) {
        let w = d.weight;
        if (w > 100) w = 30;
        if (w > 50 && w < 100) w = 15;
        if (w < 50 && w > 10) w = 10;
        if (w === 0) w = 3;
        return w;
      });
    node.on('mouseover', function(d) {
      node.attr('opacity', function(n) {
        if (d === n) return 1;
        else return 0.15;
      });

      link.attr('opacity', function(l) {
        if (d === l.source || d === l.target) return 1;
        else return 0.15;
      });
    });

    node.on('click', function(d) {
      if (d.childNodes > 0) {
        _this.validateAddress(d.name);
      }
    });

    node.on('mouseout', function() {
      link.attr('opacity', 1);
      node.attr('opacity', 1);
    });

    node
      .append('image')
      .attr('xlink:href', 'https://www.merit.me/images/favicon.ico')
      .attr('x', -2)
      .attr('y', -2)
      .attr('width', 4)
      .attr('height', 4);

    //add zoom capabilities
    let zoom_handler = d3.zoom().on('zoom', zoom_actions);
    zoom_handler(svg);

    d3.selectAll('button.zoom.ui-button.ui-button--white.in').on('click', function() {
      _this.zoomLvl.k += 0.5;
      _this.zoomLvl.x -= 500;
      _this.zoomLvl.y -= 500;
      zoom_actions(_this.zoomLvl);
    });
    d3.selectAll('button.zoom.ui-button.ui-button--white.out').on('click', function() {
      if (_this.zoomLvl.k > 0.5) {
        _this.zoomLvl.k -= 0.5;
        _this.zoomLvl.x += 500;
        _this.zoomLvl.y += 500;
        zoom_actions(_this.zoomLvl);
        zoom_actions(_this.zoomLvl);
      }
    });

    function zoom_actions(zoomLvL?) {
      if (d3.event.transform) _this.zoomLvl = d3.event.transform;
      if (zoomLvL) {
        _this.zoomLvl.k = zoomLvL.k;
        console.log(_this.zoomLvl.k);
      }

      if (_this.zoomLvl.k > 1.05 && !_this.isLabelEnable) {
        _this.isLabelEnable = true;
        node
          .append('text')
          .style('font-size', '5px')
          .style('fill', '#FFDF00')
          .attr('x', 5)
          .attr('y', -5)
          .attr('dy', '.5em')
          .text(function(d) {
            return d.label;
          });
        node
          .append('text')
          .style('font-size', '2px')
          .style('fill', '#00b0dd')
          .attr('x', 5)
          .attr('y', 0)
          .attr('dy', '.5em')
          .attr('class', 'link')
          .text(function(t) {
            if (t.childNodes > 0) return `show more +${t.childNodes}`;
          });
      } else if (_this.zoomLvl.k < 1.05) {
        _this.isLabelEnable = false;
        node.selectAll('text').remove();
      }

      g.attr('transform', `translate(${_this.zoomLvl.x},${_this.zoomLvl.y}) scale(${_this.zoomLvl.k})`);
    }

    function tickActions() {
      link
        .attr('class', 'loaded')
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

      node
        .attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')';
        })
        .attr('class', 'loaded');
      setTimeout(() => {
        _this.isGraphBuilded = true;
      }, _this.selectedMapSize);
    }
  }
}
