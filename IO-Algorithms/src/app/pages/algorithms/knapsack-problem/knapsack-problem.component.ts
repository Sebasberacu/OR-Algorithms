import { Component } from '@angular/core';
import { TableData } from '../../../interfaces/table.interface';
import { KnapsackProblemInputComponent } from '../../../components/inputs/knapsack-problem-input/knapsack-problem-input.component';
import { KnapsackItem, KnapsackProblemData } from '../../../interfaces/knapsack-problem.interface';
import { TableComponent } from '../../../components/table/table.component';

@Component({
  selector: 'app-knapsack-problem',
  standalone: true,
  imports: [KnapsackProblemInputComponent, TableComponent],
  templateUrl: './knapsack-problem.component.html',
  styleUrl: './knapsack-problem.component.css'
})
export class KnapsackProblemComponent {
  
  tableData!: TableData;
  inputTableData!: TableData;

  checkHighestPossibleValue(capacity: number, items: KnapsackItem[], itemIndex: number, maxPerItemCapacity: number): number {
    let maxValue = 0;
  
    const knapsack = (remainingCapacity: number, index: number): number => {
      if (remainingCapacity <= 0 || index < 0) {
        return 0;
      }
  
      let maxVal = 0;
      for (let count = 0; count <= maxPerItemCapacity; count++) {
        const weight = items[index].weight * count;
        const value = items[index].value * count;
  
        if (weight > remainingCapacity) break;
  
        maxVal = Math.max(maxVal, value + knapsack(remainingCapacity - weight, index - 1)); // Check the highest possible value
      }
  
      return maxVal;
    };
  
    maxValue = knapsack((capacity+1), itemIndex);
  
    return maxValue;
  }
  createInputTable(inputTableData: TableData): void{
    this.inputTableData = inputTableData;
  }

  solve(data: KnapsackProblemData): void {
    const { items, maxKnapsackCapacity, maxPerItemCapacity } = data;
    const rowHeaders: string[] = [];
    const colHeaders: string[] = Array.from({ length: maxKnapsackCapacity }, (_, i) => (i+1).toString());
    const matrix: (string)[][] = Array.from({ length: maxKnapsackCapacity }, () => Array(items.length).fill('0'));

    let greenItems: { capacity: number; itemIndex: number }[] = []; // To store the items that must go negative to see them green.

    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) { // Iterate through every item (column)
      const currentItem = items[itemIndex];
      rowHeaders.push(currentItem.identifier); // Set the column header to the item identifier
      for (let capacity = 0; capacity < maxKnapsackCapacity; capacity++) { // Iterate through every capacity (row)

        if (currentItem.weight > (capacity + 1)) { // If the item is too heavy for the current capacity
          itemIndex === 0 ? matrix[capacity][itemIndex] = '0' : matrix[capacity][itemIndex] = matrix[capacity][itemIndex - 1]; // Use the same value as the previous item
        } else { // Item can fit
          const previousElement = itemIndex === 0 ? 0 : parseInt(matrix[capacity][itemIndex - 1]);
          const highestPossibleValue = this.checkHighestPossibleValue(capacity, items, itemIndex, maxPerItemCapacity);
          
          if (highestPossibleValue > previousElement) {
            matrix[capacity][itemIndex] = (highestPossibleValue).toString(); // New item (green)
            greenItems.push({capacity, itemIndex})
          } else {
            matrix[capacity][itemIndex] = previousElement.toString();
          }
        }
      }
    }

    this.tableData = {
      rowHeaders,
      colHeaders,
      matrix
    };

    this.transformGreenItemsForTable(greenItems);

  }

  transformGreenItemsForTable(greenItems: { capacity: number; itemIndex: number }[]): void{
    // Save the green items negative (with a '-' sign) to see them green in the table
    greenItems.forEach(item => {
      this.tableData.matrix[item.capacity][item.itemIndex] = (parseInt(this.tableData.matrix[item.capacity][item.itemIndex])* -1).toString();
    });
  }

}
