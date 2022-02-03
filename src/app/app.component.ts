import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
	options = ['New York', 'Boston'];
	selected = 'New York';
	title = 'New York';
	data: any[] = [];

    constructor(private http: HttpClient ){}

	ngOnInit(): void {
		this.processData(this.selected);
	}

	onChange($event) {
		if (this.selected !== $event.target.value) {
			this.selected = $event.target.value;
			this.title = this.selected;
			this.processData(this.selected);
		}
	}

	processData(value) {
		forkJoin(
			this.http.get('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/goog-c.json'),
			this.http.get('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/aapl-c.json')
		)
		.subscribe(res => this.data[0] = res);
		forkJoin(
			this.http.get('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/msft-c.json'),
			this.http.get('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/goog-c.json')
		)
		.subscribe(res => this.data[1] = res);
	}

}
