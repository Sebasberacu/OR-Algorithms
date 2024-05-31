import { Component } from '@angular/core';
import { TableComponent } from '../../../components/table/table.component';
import { FloydInputComponent } from '../../../components/inputs/floyd-input/floyd-input.component';
import { TableData } from '../../../interfaces/table.interface';

@Component({
  selector: 'app-floyd',
  standalone: true,
  imports: [TableComponent, FloydInputComponent],
  templateUrl: './floyd.component.html',
  styleUrl: './floyd.component.css'
})
export class FloydComponent {
  public showModal: boolean = true;

  inputTableData!: TableData;
  floydSolutions: TableData[] = [];
  intermediatesSolutions: TableData[] = []; // Stores in which intermediate node the shortest path goes through

  // For keeping track of the table states for each step
  sumOfNodes: number = 0;
  possIntermediate: number = 0;
  distances: number[][] = [];
  intermediates: string[][] = [];

  //Steps completed
  stepsCompleted: boolean = false;

  solveFloyd(data: TableData): void {
    this.inputTableData = JSON.parse(JSON.stringify(data)); // Duplicate the object

    this.sumOfNodes = data.matrix.length;
    this.distances = data.matrix.map(row => row.map(cell => (cell === 'X' ? Infinity : parseFloat(cell))));
    this.intermediates = data.matrix.map(row => row.map(() => '0'));
  }

  makeNextStep(): void{
    if (this.possIntermediate >= this.sumOfNodes) this.stepsCompleted = true;

    for (let nodeI = 0; nodeI < this.sumOfNodes; nodeI++) {
      for (let nodeJ = 0; nodeJ < this.sumOfNodes; nodeJ++) {
        if (this.distances[nodeI][this.possIntermediate] + this.distances[this.possIntermediate][nodeJ] < this.distances[nodeI][nodeJ]) {
          this.distances[nodeI][nodeJ] = this.distances[nodeI][this.possIntermediate] + this.distances[this.possIntermediate][nodeJ];
          this.intermediates[nodeI][nodeJ] = (this.possIntermediate + 1).toString(); // Update routes table
        }
      }
    }
    const updatedMatrix = this.distances.map(row => row.map(cell => (cell === Infinity ? 'X' : cell.toString()))); // Convert distances back to string representation for TableData
    const intermediateSolution = JSON.parse(JSON.stringify(this.intermediates));
    this.floydSolutions.push({ ...this.inputTableData, matrix: updatedMatrix }); // Add intermediate state to solution
    this.intermediatesSolutions.push({ ...this.inputTableData, matrix: intermediateSolution }); // Add intermediate state to solution

    this.possIntermediate++;
  }



}
