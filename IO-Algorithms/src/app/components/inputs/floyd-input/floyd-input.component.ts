import { Component, EventEmitter, Output } from '@angular/core';
import { CsvParser } from '../../../utils/csv-parser';
import { NgxCSVParserError } from 'ngx-csv-parser';
import { TableData } from '../../../interfaces/table.interface';

@Component({
  selector: 'floyd-input-component',
  standalone: true,
  imports: [],
  templateUrl: './floyd-input.component.html',
  styleUrl: './floyd-input.component.css'
})
export class FloydInputComponent {
  selectedFile: File | null = null;
  csvRecords!: TableData;

  @Output() public tableData = new EventEmitter<TableData>();

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
    this.tableData.emit(this.csvRecords);
  }
}
