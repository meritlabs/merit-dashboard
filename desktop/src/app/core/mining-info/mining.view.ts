import { Component, ElementRef, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as Chart from 'chart.js';
import { Store } from '@ngrx/store';
import { IAppState } from '@dashboard/common/reducers/app.reducer';

@Component({
  selector: 'app-mining-view',
  templateUrl: './mining.view.html',
  styleUrls: ['./mining.view.sass'],
})
export class MiningViewComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('canvas') private canvas: ElementRef;

  blocks$ = this.store.select('blocks');
  chart: any;
  chartDataLabels: Array<String> = [];
  chartDataDifficult: Array<Number> = [];
  chartToolTips: Array<Array<any>> = [];

  constructor(private store: Store<IAppState>) {}
  async ngOnInit() {
    this.blocks$.subscribe(res => {
      res.blocks.map(item => {
        this.chartDataLabels.push(`${item.height}`);
        this.chartDataDifficult.push(item.difficulty);
        this.chartToolTips.push([
          `Block: ${item.height}`,
          `Time: ${item.timestamp}`,
          `Last change: -`,
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

// tooltips: [
//   ['Block: 260640', 'Time: 2018-06-27 16:41:02', 'Last change: - hours ago', 'Diff change: -'],
//   ['Block: 262080', 'Time: 2018-06-28 09:54:37', 'Last change: 17:13:35 hours ago', 'Diff change: 39.38%'],
//   ['Block: 263520', 'Time: 2018-06-29 09:16:32', 'Last change: 23:21:55 hours ago', 'Diff change: 2.74%'],
//   ['Block: 264960', 'Time: 2018-06-30 07:00:20', 'Last change: 21:43:48 hours ago', 'Diff change: 10.46%'],
//   ['Block: 266400', 'Time: 2018-07-01 16:15:14', 'Last change: 33:14:54 hours ago', 'Diff change: -27.81%'],
//   ['Block: 267840', 'Time: 2018-07-02 10:33:59', 'Last change: 18:18:45 hours ago', 'Diff change: 31.34%'],
//   ['Block: 269280', 'Time: 2018-07-03 20:23:56', 'Last change: 33:49:57 hours ago', 'Diff change: -29.06%'],
//   ['Block: 270720', 'Time: 2018-07-04 13:39:01', 'Last change: 17:15:05 hours ago', 'Diff change: 39.47%'],
//   ['Block: 272160', 'Time: 2018-07-05 21:11:12', 'Last change: 31:32:11 hours ago', 'Diff change: -23.89%'],
//   ['Block: 273600', 'Time: 2018-07-06 19:30:33', 'Last change: 22:19:21 hours ago', 'Diff change: 7.54%'],
//   ['Block: 275040', 'Time: 2018-07-08 01:14:49', 'Last change: 29:44:16 hours ago', 'Diff change: -19.28%'],
//   ['Block: 276480', 'Time: 2018-07-09 01:39:51', 'Last change: 24:25:02 hours ago', 'Diff change: -1.65%'],
//   ['Block: 277920', 'Time: 2018-07-09 19:16:19', 'Last change: 17:36:28 hours ago', 'Diff change: 36.38%'],
//   ['Block: 279360', 'Time: 2018-07-10 10:33:32', 'Last change: 15:17:13 hours ago', 'Diff change: 57.01%'],
//   ['Block: 280800', 'Time: 2018-07-11 00:43:01', 'Last change: 14:09:29 hours ago', 'Diff change: 69.53%'],
//   ['Block: 282240', 'Time: 2018-07-11 18:02:33', 'Last change: 17:19:32 hours ago', 'Diff change: 38.55%'],
//   ['Block: 283680', 'Time: 2018-07-12 13:17:00', 'Last change: 19:14:27 hours ago', 'Diff change: 24.81%'],
//   ['Block: 285120', 'Time: 2018-07-13 08:52:59', 'Last change: 19:35:59 hours ago', 'Diff change: 22.56%'],
//   ['Block: 286560', 'Time: 2018-07-14 05:21:38', 'Last change: 20:28:39 hours ago', 'Diff change: 17.25%'],
//   ['Block: 288000', 'Time: 2018-07-15 02:50:53', 'Last change: 21:29:15 hours ago', 'Diff change: 11.8%'],
//   ['Block: 289440', 'Time: 2018-07-16 06:24:22', 'Last change: 27:33:29 hours ago', 'Diff change: -12.88%'],
//   ['Block: 290880', 'Time: 2018-07-17 03:34:42', 'Last change: 21:10:20 hours ago', 'Diff change: 13.36%'],
//   ['Block: 292320', 'Time: 2018-07-18 00:36:18', 'Last change: 21:01:36 hours ago', 'Diff change: 14.19%'],
//   ['Block: 293760', 'Time: 2018-07-19 03:59:03', 'Last change: 27:22:45 hours ago', 'Diff change: -12.32%'],
//   ['Block: 295200', 'Time: 2018-07-20 02:12:11', 'Last change: 22:13:08 hours ago', 'Diff change: 8.05%'],
//   ['Block: 296640', 'Time: 2018-07-21 04:09:58', 'Last change: 25:57:47 hours ago', 'Diff change: -7.27%'],
//   ['Block: 298080', 'Time: 2018-07-22 19:43:56', 'Last change: 39:33:58 hours ago', 'Diff change: -39.32%'],
//   ['Block: 299520', 'Time: 2018-07-23 14:42:06', 'Last change: 18:58:10 hours ago', 'Diff change: 26.71%'],
//   ['Block: 300960', 'Time: 2018-07-24 13:15:36', 'Last change: 22:33:30 hours ago', 'Diff change: 6.43%'],
//   ['Block: 302400', 'Time: 2018-07-25 12:02:09', 'Last change: 22:46:33 hours ago', 'Diff change: 5.38%'],
// ],
