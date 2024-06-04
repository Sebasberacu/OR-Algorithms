import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { SportsSeriesData } from '../../../interfaces/sports-series.interface';
import { TableData } from '../../../interfaces/table.interface';

@Component({
  selector: 'sports-series-input-component',
  standalone: true,
  imports: [],
  templateUrl: './sports-series-input.component.html',
  styleUrl: './sports-series-input.component.css'
})
export class SportsSeriesInputComponent {
  selectedFile: File | null = null;
  csvRecords!: TableData;
  problemData: SportsSeriesData = {} as SportsSeriesData;

  @ViewChild('sumOfGames') sumOfGames!: ElementRef;
  @ViewChild('homeWinningChanceA') homeWinningChanceA!: ElementRef;
  @ViewChild('awayWinningChanceA') awayWinningChanceA!: ElementRef;
  @ViewChild('startsInHome') startsInHome!: ElementRef;

  @Output() public dataEmiter = new EventEmitter<SportsSeriesData>();

  constructor() {}

  emitData(): void {
    this.problemData.sumOfGames = parseInt(this.sumOfGames.nativeElement.value[0] === '1' ? '11' : this.sumOfGames.nativeElement.value[0]);
    this.problemData.homeWinningChanceA = parseFloat(this.homeWinningChanceA.nativeElement.value);
    this.problemData.awayWinningChanceA = parseFloat(this.awayWinningChanceA.nativeElement.value);
    this.problemData.startsInHome = this.startsInHome.nativeElement.checked ? true : false;

    this.problemData.gamesOrderForA = this.parseGameOrder();
    this.problemData.tableData = this.generateTableData(this.problemData.sumOfGames);

    this.dataEmiter.emit(this.problemData);
  }

  parseGameOrder(): boolean[]{
    let sumOfGames = parseInt(this.sumOfGames.nativeElement.value[0]);
    let rangeOfGames = this.sumOfGames.nativeElement.value.slice(2); // Get the (#-#) string

    if (sumOfGames === 3){
      return [true, false, false];                                                                      // (1-2)
    }

    if (sumOfGames === 5){
      return [true, true, false, false, false];                                                         // (2-3)
    }

    if (sumOfGames === 7){
      if (rangeOfGames === "(4-3)") return [true, true, true, true, false, false, false];               // (4-3)
      return [true, true, false, false, false, true, true];                                             // (2-3-2)
    }

    if (sumOfGames === 9){
      if (rangeOfGames === "(4-5)") return [true, true, true, true, false, false, false, false, false]; // (4-5)
      return [true, true, true, false, false, false, true, true, true];                                 // (3-3-3)
    }
    
    // Default case 11
    return [true, true, true, true, false, false, false, true, true, true, true];                       // (4-3-4)
  }

  generateTableData(sumOfGames: number): TableData{
    let sumOfConsiderations = ((sumOfGames + 1)/2)+1;
    const rowHeaders: string[] = Array.from({ length: sumOfConsiderations }, (_, i) => (i).toString());
    const colHeaders: string[] = [...rowHeaders];
    const matrix: string[][] = Array.from({ length: sumOfConsiderations }, () => Array.from({ length: sumOfConsiderations }, () => '-1'));
    
    // Fill the first row with '1'
    matrix[0] = Array(sumOfConsiderations).fill('1');

    // Set the first element of every row to '0'
    matrix.forEach(row => row[0] = '0');

    return {rowHeaders, colHeaders, matrix};
  }
}
