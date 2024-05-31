import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FloydComponent } from './pages/algorithms/floyd/floyd.component';
import { KnapsackProblemComponent } from './pages/algorithms/knapsack-problem/knapsack-problem.component';
import { ReplacementOfEquipmentComponent } from './pages/algorithms/replacement-of-equipment/replacement-of-equipment.component';
import { SportsSeriesComponent } from './pages/algorithms/sports-series/sports-series.component';
import { OptimalBstComponent } from './pages/algorithms/optimal-bst/optimal-bst.component';
import { MatrixMultiplicationComponent } from './pages/algorithms/matrix-multiplication/matrix-multiplication.component';

/**
 * Algorithms:
 * • Floyd–Warshall algorithm
 * • Knapsack problem
 * • Replacement of Equipment
 * • Sports Series
 * • Optimal Binary Search Trees
 * • Matrix Multiplication
 */

export const routes: Routes = [

    {path: 'algorithms', component: HomeComponent},
  
    {path: 'floyd', component: FloydComponent},

    {path: 'knapsack-problem', component: KnapsackProblemComponent},

    {path: 'replacement-of-equipment', component: ReplacementOfEquipmentComponent},

    {path: 'sports-series', component: SportsSeriesComponent},

    {path: 'optimal-binary-search-trees', component: OptimalBstComponent},

    {path: 'matrix-multiplication', component: MatrixMultiplicationComponent},

    {path: '', redirectTo: 'algorithms', pathMatch: 'full'}, // Default page

    {path: '**', redirectTo: 'algorithms'} // 404 - Not found

];
