import { ThrowStmt } from '@angular/compiler';
import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import * as Highcharts from 'highcharts/highstock';

@Component({
    selector: 'app-tschart',
    templateUrl: './tschart.component.html',
    styleUrls: ['./tschart.component.less'],
})
export class TschartComponent implements OnInit, AfterViewInit, OnChanges {
    @ViewChild('chartContainer') chartContainer: ElementRef;
	@Input() data: any = [];
	@Input() title = 'title';
    chart: any;
    option: any = {
        chart: {
			height: 600
		},
		title: {
			text: 'title'
		},
        yAxis: [
            {
                labels: {
                    format: '{value} $',
                    style: {
                        color: Highcharts.getOptions().colors[0],
                    },
                },
                title: {
                    text: 'Price',
                    style: {
                        color: Highcharts.getOptions().colors[0],
                    },
                },
				opposite: false
            },
            {
                title: {
                    text: 'New Cases',
                    style: {
                        color: Highcharts.getOptions().colors[3],
                    },
                },
                labels: {
                    style: {
                        color: Highcharts.getOptions().colors[3],
                    },
                },
                opposite: true,
            },
        ],
		xAxis: {
			type: 'datetime',
			dateTimeLabelFormats: {
				day: '%b %e',
				week: '%b %e',
				month: '%b %Y'
			}
		},
		plotOptions: {
            series: {
                showInNavigator: true
            }
        },
        tooltip: {
            shared: true,
			split: false
        },
		legend: {
			enabled: true,
			verticalAlign: 'bottom',
		},	
        credits: {
            enabled: false,
        },
        series: [
			{
				name: 'Price',
				yAxis: 0,
				tooltip: {
					valueSuffix:' $'
				},
				data: []
			},
			{
				name: 'New Cases',
				yAxis: 1,
				color: Highcharts.getOptions().colors[3],
				data: []
			}
		],
    };

    constructor() {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.data && this.data && this.data.length) {
			this.data.forEach((datum, idx) => this.option.series[idx].data = datum);
			this.option.title.text = this.title;
			this.draw();
		}
	}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.option.chart.renderTo = this.chartContainer.nativeElement;
		if (this.data && this.data.length) {
			this.data.forEach((datum, idx) => this.option.series[idx].data = datum);
			this.option.title.text = this.title;
			this.draw();
		}
    }

	draw() {
		if (this.chart) {
			this.chart.destroy();
		}
		this.chart = new Highcharts.StockChart(this.option);
	}
}
