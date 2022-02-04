import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as xlsx from 'xlsx';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
	options = ['New York, New York, US'];
	selected = 'New York, New York, US';
	title = 'New York';
	data: any[] = [[[], []], [[], []]];

    constructor(private http: HttpClient ){
		this.http.get('assets/input.xlsx', { responseType: 'blob' }).subscribe(data => {
			const reader: FileReader = new FileReader();
			reader.onload = (e: any) => {
				const bstr: string = e.target.result;
				const arr = xlsx.read(bstr, { type: 'binary' }).SheetNames;
				for (const item of arr) {
					if (item!== 'New York, New York, US') {
						this.options.push(item);
					}
					this.options.sort();
				}
			};
			reader.readAsBinaryString(data);
		});
	}

	ngOnInit(): void {
		this.processData(this.selected);
	}

	onChange($event) {
		if (this.selected !== $event.target.value) {
			this.selected = $event.target.value;
			this.title = this.selected.split(',')[0];
			this.processData(this.selected);
		}
	}

	processData(value) {
		const location = value.split(',')[0].split(' ').join('');
		this.http.get(`assets/${location}.json`).subscribe((res: any[]) => {
			this.data = [[[], []], [[], []]];
			res.forEach(item => {
				const dateTime = new Date(item.Type).getTime();
				const rent = parseInt(item.Rent);
				const cases = parseInt(item.Case);
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
