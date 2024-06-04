import { Component } from '@angular/core';
import { OptimalBstInputComponent } from '../../../components/inputs/optimal-bst-input/optimal-bst-input.component';
import { TableData } from '../../../interfaces/table.interface';
import { TableComponent } from "../../../components/table/table.component";
import { OptimalBstData } from '../../../interfaces/optimal-bst.interface';

@Component({
  selector: 'app-optimal-bst',
  standalone: true,
  imports: [OptimalBstInputComponent, TableComponent],
  templateUrl: './optimal-bst.component.html',
  styleUrl: './optimal-bst.component.css'
})
export class OptimalBstComponent {
  probabilitiesTable !: TableData;
  resultsTable !: TableData;

  solve(data: OptimalBstData){
    // Initialize tables
    this.probabilitiesTable = {} as TableData;
    this.resultsTable = {} as TableData;

    this.initializeProbabilitiesTable(data);
    this.setStaticProbabilities(data);

    let matrix = this.probabilitiesTable.matrix;

    let squaredMatrixN = data.keys.length + 1;
    let missingCells = (((squaredMatrixN ** 2) - squaredMatrixN) / 2) - (squaredMatrixN - 1);

    let diagonalCounter = 0; // Counts the diagonals iterated since we are going from diagonal to diagonal
    let rowIndex = 0;
    let colIndex = diagonalCounter + 2; // Initial first two values are filled

    // Loop that iterates through all the missing cells from diagonal (left top to right bottom) to diagonal
    while(missingCells > 0){
      missingCells--; // Substract and then make the logic

      let sumOfChancesOfPossiblesK = 0;
      for(let k=rowIndex; k<colIndex; k++){ // Get the sum of the probabilites of every possible K
        sumOfChancesOfPossiblesK += parseFloat(matrix[k][k+1]);
      }

      let possibleValues: {value: number, k: number}[] = [];
      for(let k=rowIndex; k<colIndex; k++){
        // Original formula changes: in example columns were ahead in 1, so no need to decrement the K while accessing columns with K
        let possibleValue = parseFloat(matrix[rowIndex][k]) + parseFloat(matrix[k+1][colIndex]) + sumOfChancesOfPossiblesK;
        possibleValues.push({value: possibleValue, k: k});
      }
      
      const bestValue = Math.min(...(possibleValues.map( values => values.value)));
      matrix[rowIndex][colIndex] = bestValue.toString(); // Set the value to the cell

      const bestItem = possibleValues.find(item => item.value === bestValue);
      if (bestItem) this.resultsTable.matrix[rowIndex][colIndex] = data.keys[bestItem.k].identifier;
      
      if ((colIndex + 1) == squaredMatrixN){
        diagonalCounter++;
        rowIndex = 0;
        colIndex = diagonalCounter + 2;
      } else {
        rowIndex++;
        colIndex++;
      }
    }

    this.roundValues()

  }

  initializeProbabilitiesTable(data: OptimalBstData){
    let squaredMatrixN = data.keys.length + 1;

    // All matrix in -
    this.probabilitiesTable.matrix = Array.from({ length: squaredMatrixN }, () => Array.from({ length: squaredMatrixN }, () => '-'));

    // Row Headers: First element no key and next elements equal to every key identifier
    this.probabilitiesTable.rowHeaders = ['0'];
    this.probabilitiesTable.rowHeaders.push(...data.keys.map(key => key.identifier));

    // Col Headers: Last element no key and first elements equal to every key identifier
    this.probabilitiesTable.colHeaders = [...data.keys.map(key => key.identifier)];
    this.probabilitiesTable.colHeaders.push(data.keys.length.toString());

    this.resultsTable.matrix = Array.from({ length: squaredMatrixN }, () => Array.from({ length: squaredMatrixN }, () => '-'));

    this.resultsTable.rowHeaders = ['0'];
    this.resultsTable.rowHeaders.push(...data.keys.map(key => key.identifier));

    this.resultsTable.colHeaders = [...data.keys.map(key => key.identifier)];
    this.resultsTable.colHeaders.push(data.keys.length.toString());
    
  }

  setStaticProbabilities(data: OptimalBstData){
    let squaredMatrixN = data.keys.length + 1;

    let rowIndex = 0;
    let colIndex = 0;

    while (rowIndex <= squaredMatrixN && colIndex <= squaredMatrixN){
      if (rowIndex == colIndex)
        this.probabilitiesTable.matrix[rowIndex][colIndex] = '0'; // Null probability

      if (rowIndex == colIndex - 1)
        this.probabilitiesTable.matrix[rowIndex][colIndex] = data.keys[rowIndex].probability.toString();

      // Iterate one row at the time
      if((colIndex + 1) < squaredMatrixN) {
        colIndex++;
      } else {
        colIndex = 0;
        rowIndex++;
      }
    }
  }

  roundValues(){
    let matrix = this.probabilitiesTable.matrix;
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (j < i) continue;
        matrix[i][j] = parseFloat(matrix[i][j]).toFixed(3);
      }
    }
  }
}
