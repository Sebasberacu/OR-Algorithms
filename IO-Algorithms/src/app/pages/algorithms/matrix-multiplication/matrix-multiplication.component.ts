import { Component } from '@angular/core';
import { Matrix, MatrixMultiplicationData } from '../../../interfaces/matrix-multiplication.interface';
import { TableData } from '../../../interfaces/table.interface';
import { MatrixMultiplicationInputComponent } from '../../../components/inputs/matrix-multiplication-input/matrix-multiplication-input.component';
import { TableComponent } from '../../../components/table/table.component';

@Component({
  selector: 'app-matrix-multiplication',
  standalone: true,
  imports: [MatrixMultiplicationInputComponent, TableComponent],
  templateUrl: './matrix-multiplication.component.html',
  styleUrl: './matrix-multiplication.component.css'
})
export class MatrixMultiplicationComponent {
  valuesTable !: TableData;
  resultsTable !: TableData;
  matrices: Matrix[] = [];

  solve(data: MatrixMultiplicationData){
    this.matrices = data.matrices;

    // Initialize tables
    this.valuesTable = {} as TableData;
    this.resultsTable = {} as TableData;

    this.initializeTables(data);
    this.setStaticProbabilities(data);

    let matrix = this.valuesTable.matrix;

    let squaredMatrixN = data.matrices.length;
    let missingCells = (((squaredMatrixN ** 2) - squaredMatrixN) / 2) - (squaredMatrixN - 1);

    let diagonalCounter = 0; // Counts the diagonals iterated since we are going from diagonal to diagonal
    let rowIndex = 0;
    let colIndex = diagonalCounter + 2; // Initial first two values are filled

    // Loop that iterates through all the missing cells from diagonal (left top to right bottom) to diagonal
    while(missingCells > 0){
      missingCells--; // Substract and then make the logic

      let possibleValues: {value: number, k: number}[] = [];
      for(let k=rowIndex; k<colIndex; k++){
        let possibleValue = parseFloat(matrix[rowIndex][k]) + parseFloat(matrix[k+1][colIndex]) + (data.matrices[rowIndex].rows * data.matrices[colIndex].columns * data.matrices[k].columns);
        possibleValues.push({value: possibleValue, k: k});
      }
      
      const bestValue = Math.min(...(possibleValues.map( values => values.value)));
      matrix[rowIndex][colIndex] = bestValue.toString(); // Set the value to the cell

      const bestItem = possibleValues.find(item => item.value === bestValue);
      if (bestItem) this.resultsTable.matrix[rowIndex][colIndex] = (bestItem.k + 1).toString();
      
      if ((colIndex + 1) == squaredMatrixN){
        diagonalCounter++;
        rowIndex = 0;
        colIndex = diagonalCounter + 2;
      } else {
        rowIndex++;
        colIndex++;
      }
    }

  }

  initializeTables(data: MatrixMultiplicationData){
    let squaredMatrixN = data.matrices.length;

    // All matrix in -
    this.valuesTable.matrix = Array.from({ length: squaredMatrixN }, () => Array.from({ length: squaredMatrixN }, () => '-'));
    // Row Headers
    this.valuesTable.rowHeaders = Array.from({length: squaredMatrixN}, (_, i) => (i+1).toString());
    // Col Headers
    this.valuesTable.colHeaders = Array.from({length: squaredMatrixN}, (_, i) => (i+1).toString());

    // All matrix in -
    this.resultsTable.matrix = Array.from({ length: squaredMatrixN }, () => Array.from({ length: squaredMatrixN }, () => '-'));
    // Row Headers
    this.resultsTable.rowHeaders = Array.from({length: squaredMatrixN}, (_, i) => (i+1).toString());
    // Col Headers
    this.resultsTable.colHeaders = Array.from({length: squaredMatrixN}, (_, i) => (i+1).toString());
    
  }

  setStaticProbabilities(data: MatrixMultiplicationData){
    let squaredMatrixN = data.matrices.length;

    let rowIndex = 0;
    let colIndex = 0;

    while (rowIndex <= squaredMatrixN && colIndex <= squaredMatrixN){
      if (rowIndex == colIndex){
        this.valuesTable.matrix[rowIndex][colIndex] = '0'; // Null probability
        this.resultsTable.matrix[rowIndex][colIndex] = '0';
      }

      if (rowIndex == colIndex - 1){
        this.valuesTable.matrix[rowIndex][colIndex] = (data.matrices[rowIndex].rows * data.matrices[rowIndex].columns * data.matrices[rowIndex + 1].columns).toString();
        this.resultsTable.matrix[rowIndex][colIndex] = (rowIndex + 1).toString();
      }

      // Iterate one row at the time
      if((colIndex + 1) < squaredMatrixN) {
        colIndex++;
      } else {
        colIndex = 0;
        rowIndex++;
      }
    }
  }

  
}
