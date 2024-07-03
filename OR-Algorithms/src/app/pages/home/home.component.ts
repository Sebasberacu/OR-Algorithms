import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
  public algorithms: { name: string, info: string, route: string }[] = [
    { name: 'FLOYD ALGORITHM', info: 'Floyd-Warshall algorithm for finding shortest paths in a weighted graph with positive or negative edge weights.', route: 'floyd'},
    { name: 'KNAPSACK PROBLEM', info: 'Solving the 0/1 knapsack problem using dynamic programming to maximize profit with given weight constraints.', route: 'knapsack-problem'},
    { name: 'REPLACEMENT OF EQUIPMENT', info: 'Strategies for replacing equipment at optimal intervals to minimize cost or maximize efficiency.', route: 'replacement-of-equipment'},
    { name: 'SPORTS SERIES', info: 'Dynamic programming approach to determine the probability of winning a sports series.', route: 'sports-series'},
    { name: 'OPTIMAL BINARY SEARCH TREE', info: 'Constructing a binary search tree with minimal search cost given access probabilities for each key.', route: 'optimal-binary-search-trees'},
    { name: 'MATRIX MULTIPLICATION', info: 'Efficiently multiplying a chain of matrices using dynamic programming to minimize the total number of multiplications.', route: 'matrix-multiplication'}
  ];

  public hoveredIndex: number | null = null;

  showInfo(index: number): void {
    this.hoveredIndex = index;
  }

  hideInfo(): void {
    this.hoveredIndex = null;
  }
}
