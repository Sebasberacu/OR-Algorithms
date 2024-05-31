import { Component, Input } from '@angular/core';

@Component({
  selector: 'table-component',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  @Input() public rows!: number;
  @Input() public columns!: number;
  @Input() public data!: any;
}
