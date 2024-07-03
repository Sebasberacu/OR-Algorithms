import { Component } from '@angular/core';
import { SportsSeriesInputComponent } from '../../../components/inputs/sports-series-input/sports-series-input.component';
import { SportsSeriesData } from '../../../interfaces/sports-series.interface';
import { TableData } from '../../../interfaces/table.interface';
import { TableComponent } from "../../../components/table/table.component";

@Component({
    selector: 'app-sports-series',
    standalone: true,
    templateUrl: './sports-series.component.html',
    styleUrl: './sports-series.component.css',
    imports: [SportsSeriesInputComponent, TableComponent]
})
export class SportsSeriesComponent {
  tableData !: TableData;
  problemData !: SportsSeriesData;

  winningPorcentage = '';
  losingPorcentage = '';

  solve(data: SportsSeriesData){
    this.tableData = {} as TableData;
    this.problemData = {} as SportsSeriesData;

    const { sumOfGames, homeWinningChanceA, awayWinningChanceA, startsInHome, gamesOrderForA, tableData } = data;

    let rowIndex = 1; // starts in 1 to skip the first row (already filled with 1s)
    let colIndex = 1; // starts in 1 to skip the first column (already filled with 0s)

    let maxPossibleGames = (sumOfGames + 1)/2;

    while (rowIndex <= maxPossibleGames && colIndex <= maxPossibleGames){
      let currentGame = (maxPossibleGames - rowIndex) + (maxPossibleGames - colIndex) + 1;

      let leftCell = tableData.matrix[rowIndex][colIndex-1];
      let aboveCell = tableData.matrix[rowIndex-1][colIndex];
      let chanceOfWin = 0.0;

      if (gamesOrderForA[currentGame-1] === startsInHome) // Game at home
      chanceOfWin = (parseFloat(leftCell) * (1-homeWinningChanceA)) + (parseFloat(aboveCell) * homeWinningChanceA);

      else // Game away
      chanceOfWin = (parseFloat(leftCell) * (1-awayWinningChanceA)) + (parseFloat(aboveCell) * awayWinningChanceA);

      tableData.matrix[rowIndex][colIndex] = chanceOfWin.toString();

      // Iterate one row at the time
      if((colIndex + 1) <= maxPossibleGames) {
        colIndex++;
      } else {
        colIndex = 1;
        rowIndex++;
      }
    }
    this.problemData = data;
    this.tableData = tableData;

    this.roundValues();
    this.setWinningPorcentage();
  }

  roundValues(){
    let matrix = this.tableData.matrix;
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        matrix[i][j] = parseFloat(matrix[i][j]).toFixed(4);
      }
    }
  }

  setWinningPorcentage(){
    let rawValue = this.tableData.matrix[this.tableData.matrix.length - 1][this.tableData.matrix[this.tableData.matrix.length - 1].length - 1];
    this.winningPorcentage = ((parseFloat(rawValue) * 100).toFixed(3)).toString();
    this.losingPorcentage = (((1 - parseFloat(rawValue)) * 100).toFixed(3)).toString();
  }
}
