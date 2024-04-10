import { Component, OnInit } from '@angular/core';
import { DailyReportsComponent } from './daily-reports/daily-reports.component';
import { SummaryReportsComponent } from './summary-reports/summary-reports.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reportOption: any[] = [
    { label: "Daily Reports", component: DailyReportsComponent },
    { label: "Summary Reports", component: SummaryReportsComponent },
   
  ];
  reportComponent: any;
  activeTabIndex: number = 0; // Tracks the index of the active tab


  constructor() { }

  ngOnInit(): void {
    this.reportComponent = this.reportOption[0].component;
  }

  changeHandler(ind: number): void {
    this.reportComponent = this.reportOption[ind].component;
    this.activeTabIndex = ind; // Update the active tab index
  }
}
