import { Component, Input } from '@angular/core';
import { TableData } from '../../interfaces/table.interface';

@Component({
  selector: 'table-component',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  @Input() public tableData!: TableData;
}
