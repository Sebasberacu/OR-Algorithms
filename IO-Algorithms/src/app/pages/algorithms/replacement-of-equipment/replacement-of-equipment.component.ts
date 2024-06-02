import { Component } from '@angular/core';
import { ReplacementOfEquipmentInputComponent } from '../../../components/inputs/replacement-of-equipment-input/replacement-of-equipment-input.component';
import { ReplacementOfEquipmentData } from '../../../interfaces/replacement-of-equipment.interface';
import { TableComponent } from '../../../components/table/table.component';
import { TableData } from '../../../interfaces/table.interface';

@Component({
  selector: 'app-replacement-of-equipment',
  standalone: true,
  imports: [ReplacementOfEquipmentInputComponent, TableComponent],
  templateUrl: './replacement-of-equipment.component.html',
  styleUrl: './replacement-of-equipment.component.css'
})
export class ReplacementOfEquipmentComponent {
  inputTableData!: TableData;
  tableData !: TableData;

  optimalPath: string = "";

  solve(data: ReplacementOfEquipmentData): void {
    this.optimalPath = "";
    this.inputTableData = JSON.parse(JSON.stringify(data.tableData)); // Duplicate the object
    
    const { initialCost, planDuration, usefulLife } = data;

    const costsPerYear: number[] = this.getCostsPerYear(initialCost, usefulLife, data.tableData);

    let bestSolutions: {cost: number, nextYear: number}[] = [];

    for (let year = planDuration; year >= 0; year--){
      if (year === planDuration){ // Last year cost of the plan
        bestSolutions.push({cost: 0, nextYear: planDuration});
        continue;
      }

      let yearSolutions: {cost: number, nextYear: number}[] = [];
      for (let finalYear = (year+1); finalYear <= (year+usefulLife); finalYear++) {
        if (finalYear > planDuration) break;
        let yearsOfUse = finalYear - year;

        yearSolutions.push({
          cost: costsPerYear[yearsOfUse-1] + bestSolutions[planDuration - finalYear].cost,
          nextYear: finalYear
        });
      }
      bestSolutions.push(yearSolutions.filter(solution => solution.cost === Math.min(...yearSolutions.map(solution => solution.cost)))[0]); // Extract the best solution
    }

    this.setTableData(bestSolutions, planDuration);
    this.setOptimalPlan(bestSolutions);
  }

  getCostsPerYear(initialCost: number, usefulLife: number, data: TableData): number[] {
    const costsPerYear: number[] = [];
    for (let i = 0; i < usefulLife; i++) {
      let sumOfMaintenanceCosts: number = 0;
      let currentIndex: number = i;
      while (currentIndex >= 0) {
        sumOfMaintenanceCosts += parseInt(data.matrix[currentIndex][1]);
        currentIndex --;
      }
      // (initialCost + sumOfMaintenanceCosts) - resellValue
      costsPerYear.push((initialCost + sumOfMaintenanceCosts) - parseInt(data.matrix[i][0]));
    }
    return costsPerYear;
  }

  setTableData(bestSolutions: {cost: number, nextYear: number}[], planDuration: number): void {
    bestSolutions = bestSolutions.reverse(); // Reverse because the original order is from end to start

    const rowHeaders: string[] = ['G(t)', 'Next Year'];
    const colHeaders: string[] = Array.from({ length: planDuration }, (_, i) => (i).toString());
    colHeaders.push(planDuration.toString()); // Add the last year header
    const matrix: string[][] = bestSolutions.map(solution => [solution.cost.toString(), solution.nextYear.toString()]);

    this.tableData = { rowHeaders, colHeaders, matrix };
  }

  setOptimalPlan(bestSolutions: {cost: number, nextYear: number}[]): void{
    let currentYear: number = 0;

    this.optimalPath += currentYear.toString(); // Push the initial year (0)

    for (let i = 0; i < bestSolutions.length; i++) {
      console.log(bestSolutions[i]);
      if (bestSolutions[i].nextYear > currentYear) {
        currentYear = bestSolutions[i].nextYear;
        this.optimalPath += ` - ${currentYear}`;
      }
    }
  }
}
