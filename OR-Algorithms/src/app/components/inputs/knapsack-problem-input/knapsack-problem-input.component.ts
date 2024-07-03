import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { TableData } from '../../../interfaces/table.interface';
import { CsvParser } from '../../../utils/csv-parser';
import { KnapsackProblemData } from '../../../interfaces/knapsack-problem.interface';

@Component({
  selector: 'knapsack-problem-input-component',
  standalone: true,
  imports: [],
  templateUrl: './knapsack-problem-input.component.html',
  styleUrl: './knapsack-problem-input.component.css'
})
export class KnapsackProblemInputComponent {
  selectedFile: File | null = null;
  csvRecords!: TableData;
  problemData: KnapsackProblemData = {} as KnapsackProblemData;

  @ViewChild('maxCapacity') maxCapacity!: ElementRef;
  @ViewChild('maxCapacityPerItem') maxCapacityPerItem!: ElementRef;

  @Output() public dataEmiter = new EventEmitter<KnapsackProblemData>();
  @Output() public inputTableEmiter = new EventEmitter<TableData>();

  constructor(private csvParser: CsvParser) {}

  onFileChange(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  confirmFile(): void {
    if (this.selectedFile){
      // Not validated CSV
      this.csvParser.parseCsv(this.selectedFile).subscribe({
        next: (result): void => {
          this.csvRecords = result;
          this.emitData();
        },
        error: (error: any): void => {
          console.error('Error', error);
        }
      });
    }
  }

  emitData(): void {
    this.problemData.items = this.csvRecords.matrix.map((row, index) => {
      return {
        value: parseFloat(row[0]),
        weight: parseFloat(row[1]),
        identifier: this.csvRecords.colHeaders[index]
      };
    });

    this.problemData.maxKnapsackCapacity = this.maxCapacity.nativeElement.value;
    this.problemData.maxPerItemCapacity = this.maxCapacityPerItem.nativeElement.value;
    
    this.dataEmiter.emit(this.problemData);
    this.inputTableEmiter.emit(this.csvRecords);
  }
}
