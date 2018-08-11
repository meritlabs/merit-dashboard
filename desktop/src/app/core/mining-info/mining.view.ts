import { Component, ElementRef, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as Chart from 'chart.js';
import { Store } from '@ngrx/store';
import { IAppState } from '@dashboard/common/reducers/app.reducer';
import { IBlocks } from '@dashboard/common/models/blocks';
import { LoadBlocks } from '@dashboard/common/actions/blocks.action';
import { DashboardAPI_Service } from '@dashboard/common/services/dashboard-api.service';

@Component({
  selector: 'app-mining-view',
  templateUrl: './mining.view.html',
  styleUrls: ['./mining.view.sass'],
})
export class MiningViewComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('canvas')
  private canvas: ElementRef;

  blocks$ = this.store.select('blocks');
  chart: any;
  chartDataLabels: Array<String> = [];
  chartDataDifficult: Array<Number> = [];
  chartToolTips: Array<Array<any>> = [];

  constructor(private store: Store<IAppState>, public dashboardAPI: DashboardAPI_Service) {}
  async ngOnInit() {
    this.store.dispatch(new LoadBlocks({ loading: false, blocks: await this.dashboardAPI.getBlocksInfo() } as IBlocks));
    this.blocks$.subscribe(res => {
      res.blocks.map(item => {
        this.chartDataLabels.push(`${item.height}`);
        this.chartDataDifficult.push(item.difficulty);
        this.chartToolTips.push([
          `Block: ${item.height}`,
          `Time: ${item.timestamp}`,
          `Last change: ${item.lastChange}`,
          `Diff change: ${item.difficultyChange}`,
        ]);
      });

      this.createChart();
    });
  }

  private createChart() {
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.chartDataLabels,
        tooltips: this.chartToolTips,
        datasets: [
          {
            data: this.chartDataDifficult,
            backgroundColor: 'rgba(0,176,221, 0.3)',
            borderColor: 'rgba(0,176,221,1)',
            borderWidth: 4,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        spanGaps: false,
        elements: {
          line: {
            tension: 0.000001,
          },
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: false,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
        tooltips: {
          callbacks: {
            title: function(tooltipItem, data) {
              return data.tooltips[tooltipItem[0].index];
            },
          },
        },
      },
    });
  }

  ngOnDestroy() {
    this.deleteChart();
  }

  private deleteChart() {
    this.chart && this.chart.clear() && this.chart.destroy();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.chart && this.chart.resize();
  }
}
