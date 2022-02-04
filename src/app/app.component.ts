import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
	options = ['New York'];
	selected = 'New York';
	title = 'New York';
	data: any[];

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
		const location = value.split(' ').join('');
		this.data = [[[], []], [[], []]];
		this.http.get(`assets/${location}.json`).subscribe((res: any[]) => {
			res.forEach(item => {
				const dateTime = new Date(item.Date).getTime();
				const rent = item.Rent;
				const cases = item.Case;
				const rentLP = parseFloat((item.RentLP * 100).toFixed(2));
				const caseLP = parseFloat((item.CaseLP * 100).toFixed(2));
				this.data[0][0].push([dateTime, rent]);
				this.data[0][1].push([dateTime, cases]);
				this.data[1][0].push([dateTime, rentLP]);
				this.data[1][1].push([dateTime, caseLP]);
			})
		});
	}

}
