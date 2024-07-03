import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Key, OptimalBstData } from '../../../interfaces/optimal-bst.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'optimal-bst-input-component',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './optimal-bst-input.component.html',
  styleUrl: './optimal-bst-input.component.css'
})
export class OptimalBstInputComponent {
  sumOfWeights: number = 0;
  sumOfKeys: number = 0;
  keys: Key[] = [];

  problemData: OptimalBstData = {} as OptimalBstData;

  @Output() public dataEmiter = new EventEmitter<OptimalBstData>();

  constructor() {}

  emitData(): void {
    this.setKeysProbability();

    this.problemData.keys = this.keys;
    this.dataEmiter.emit(this.problemData);
  }

  sumOfKeysChanged(value: string){
    this.sumOfKeys = parseInt(value);

    let newKeys = this.sumOfKeys - this.keys.length;

    if (newKeys > 0){ // Keys added
      for (let keyIndex = 0; keyIndex < newKeys; keyIndex++){
        this.keys.push({identifier: "", probability: 0, weight: 0}); // Add a new defaults keys
      }
    } else { // Keys reduced
      this.keys.splice(newKeys);
    }
  }

  setKeysProbability(){
    const totalWeight = this.keys.reduce((sum, key) => sum + key.weight, 0);
    for (let key of this.keys){
      key.probability = key.weight/totalWeight;
    }
  }
}
