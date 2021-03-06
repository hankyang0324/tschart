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
	@Input() yLabels = ['Rental Price', 'New Cases'];
	@Input() differential = false;
    chart: any;
    option: any = {
        chart: {
			height: 450
		},
		title: {
			text: 'title'
		},
        yAxis: [
            {
                labels: {
                    formatter: function() {
						return this.value + '$/month';
					},
                    style: {
                        color: Highcharts.getOptions().colors[0],
                    },
                },
                title: {
                    text: this.yLabels[0],
                    style: {
                        color: Highcharts.getOptions().colors[0],
                    },
                },
				opposite: false,
				plotLines: [
					{
						value: 0,
						width: 2,
						color: 'silver'
					}
				],
				showLastLabel: true
            },
            {
				labels: {
					formatter: function() {
						if (this.value > 1000) {
							return this.value / 1000 + 'k'
						}
						return this.value;
					},
                    style: {
                        color: Highcharts.getOptions().colors[3],
                    },
                },
                title: {
                    text: this.yLabels[1],
                    style: {
                        color: Highcharts.getOptions().colors[3],
                    },
                },
                opposite: true,
				plotLines: [
					{
						value: 0,
						width: 2,
						color: 'black'
					}
				],
				showLastLabel: true
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
                showInNavigator: true,
				dataGrouping: {
					enabled: false
				}
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
				name: this.yLabels[0],
				yAxis: 0,
				tooltip: {
					valueSuffix:'$/month'
				},
				type: 'spline',
				data: []
			},
			{
				name: this.yLabels[1],
				yAxis: 1,
				tooltip: {
					valueSuffix:''
				},
				type: 'column',
				color: '#F7A35C90',
				data: []
			}
		],
    };

    constructor() {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.data && this.data && this.data.length) {
			this.data.forEach((datum, idx) => this.option.series[idx].data = datum);
			this.option.title.text = this.title;
			if (this.differential) {
				for (let i = 0; i < 2; i++) {
					this.option.yAxis[i].title.text = this.yLabels[i] + ' Differential'
					this.option.series[i].name = this.yLabels[i] + ' Differential';
					this.option.series[i].tooltip.valueSuffix = '%';
				}
				this.option.yAxis[0].labels.formatter = function() {
					return (this.value > 0 ? '+' : '') + this.value + '%';
				}
				this.option.yAxis[1].labels.formatter = function() {
					return (this.value > 0 ? '+' : '') + this.value + '%';
				}
				this.option.series[1].type = 'spline';
			}
			this.draw();
		}
	}

    ngOnInit(): void {
		Highcharts.setOptions({
			lang: {
				thousandsSep: ''
			}
		})
	}

    ngAfterViewInit(): void {
        this.option.chart.renderTo = this.chartContainer.nativeElement;
		if (this.data && this.data.length) {
			this.data.forEach((datum, idx) => this.option.series[idx].data = datum);
			this.option.title.text = this.title;
			if (this.differential) {
				for (let i = 0; i < 2; i++) {
					this.option.yAxis[i].title.text = this.yLabels[i] + ' Differential'
					this.option.series[i].name = this.yLabels[i] + ' Differential';
					this.option.series[i].tooltip.valueSuffix = '%';
				}
				this.option.yAxis[0].labels.formatter = function() {
					return (this.value > 0 ? '+' : '') + this.value + '%';
				}
				this.option.yAxis[1].labels.formatter = function() {
					return (this.value > 0 ? '+' : '') + this.value + '%';
				}
				this.option.series[1].type = 'spline';
			}
			this.draw();
		}
    }

	draw() {
		if (this.chart) {
			this.chart.destroy();
		}
		this.chart = new Highcharts.StockChart(this.option);
		if (this.differential) {
			const range0 = this.chart.yAxis[0].getExtremes();
			const range1 = this.chart.yAxis[1].getExtremes();
			const max0 = Math.max(Math.abs(range0.min), Math.abs(range0.max));
			const max1 = Math.max(Math.abs(range1.min), Math.abs(range1.max));
			this.chart.yAxis[0].update({
				min: -max0,
				max: max0
			});
			this.chart.yAxis[1].update({
				min: -max1,
				max: max1
			})
		}
	}
}
