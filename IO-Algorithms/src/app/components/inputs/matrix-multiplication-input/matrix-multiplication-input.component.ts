import { Component, EventEmitter, Output } from '@angular/core';
import { Matrix, MatrixMultiplicationData } from '../../../interfaces/matrix-multiplication.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'matrix-multiplication-input-component',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './matrix-multiplication-input.component.html',
  styleUrl: './matrix-multiplication-input.component.css'
})
export class MatrixMultiplicationInputComponent {
  sumOfMatrices: number = 0;
  matrices: Matrix[] = [];

  problemData: MatrixMultiplicationData = {} as MatrixMultiplicationData;

  @Output() public dataEmiter = new EventEmitter<MatrixMultiplicationData>();

  constructor() {}

  emitData(): void {

    this.problemData.matrices = this.matrices;
    this.dataEmiter.emit(this.problemData);
  }

  sumOfMatricesChanged(){
    this.sumOfMatrices++;

    if (this.matrices[this.matrices.length - 1]) this.matrices.push({rows: this.matrices[this.matrices.length - 1].columns, columns: 0});
    else this.matrices.push({rows: 0, columns: 0}); // Add a new defaults keys
  }
}
