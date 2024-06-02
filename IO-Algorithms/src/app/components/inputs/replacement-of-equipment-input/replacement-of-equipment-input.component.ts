import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { TableData } from '../../../interfaces/table.interface';
import { CsvParser } from '../../../utils/csv-parser';
import { ReplacementOfEquipmentData } from '../../../interfaces/replacement-of-equipment.interface';

@Component({
  selector: 'replacement-of-equipment-input-component',
  standalone: true,
  imports: [],
  templateUrl: './replacement-of-equipment-input.component.html',
  styleUrl: './replacement-of-equipment-input.component.css'
})
export class ReplacementOfEquipmentInputComponent {
  selectedFile: File | null = null;
  csvRecords!: TableData;
  problemData: ReplacementOfEquipmentData = {} as ReplacementOfEquipmentData;

  @ViewChild('initialCost') initialCost!: ElementRef;
  @ViewChild('usefulLife') usefulLife!: ElementRef;
  @ViewChild('planDuration') planDuration!: ElementRef;

  @Output() public dataEmiter = new EventEmitter<ReplacementOfEquipmentData>();

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
    this.problemData.initialCost = parseInt(this.initialCost.nativeElement.value);
    this.problemData.usefulLife = parseInt(this.usefulLife.nativeElement.value);
    this.problemData.planDuration = parseInt(this.planDuration.nativeElement.value);

    this.problemData.tableData = this.csvRecords;

    this.dataEmiter.emit(this.problemData);
  }
}
