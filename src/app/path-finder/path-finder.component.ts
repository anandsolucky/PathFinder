import { Component, OnInit } from '@angular/core';
import { AlgorithmServiceService } from '../algorithm-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-path-finder',
  templateUrl: './path-finder.component.html',
  styleUrls: ['./path-finder.component.css']
})
export class PathFinderComponent implements OnInit {
/***********************************************************************/
  rows = [];
  cols = [];
  grid = [];
  calculatingGrid = [];
  first = true; isSourceSet = false; isDestSet = false; isDragOn = false;
  dest = true;
  source; destination;
  i: number;
  j: number;
  gridSize = 14;
  pathInAlphabet = [];
  pathinCellPoints = [];
  row: number; col: number;
  stylePathArr = [];
  visualizeButtonListener: Subscription;
  pathGenrationListener: Subscription;
  /***********************************************************************/
  constructor(private algorithmService: AlgorithmServiceService) {

    for ( this.i = 0; this.i <= this.gridSize; this.i++) {
      this.grid[this.i] = [];
      for ( this.j = 0; this.j <= this.gridSize + 26; this.j++ ) {
          this.grid[this.i][this.j] = '' + this.i + ',' + this.j + '';
        }
    }
    // for ( this.i = 0; this.i <= this.gridSize; this.i++) {
    //   console.log(this.grid[this.i]);
    // }
    // +26
    this.calculatingGrid = [...this.grid];
    for ( this.i = 0; this.i <= this.gridSize; this.i++) {
      this.calculatingGrid[this.i] = [];
      for ( this.j = 0; this.j <= this.gridSize + 26 ; this.j++ ) {
          this.calculatingGrid[this.i][this.j] = '1';
        }
    }
  }
  ngOnInit() {
    this.visualizeButtonListener = this.algorithmService.VisualbuttonClickListener()
      .subscribe(() => {
        // calling AStart algorithm with the grid, source, & destination as parameter
        this.algorithmService.AstarSearchAlgo(this.calculatingGrid, this.source, this.destination);
      });
    this.pathGenrationListener = this.algorithmService.PathGenerateListener()
      .subscribe( (receivedPath) => {
        this.stylePathArray(receivedPath);
      });
  }
  onClick(cell) {
    this.row = parseInt (cell.split(',')[0], 10);
    this.col = parseInt (cell.split(',')[1], 10);

    if (!this.isSourceSet) { // if source not selected yet
      this.isSourceSet = true;
      this.setSource(cell);
    } else if (!this.isDestSet) { // if destination not selected yet
      this.isDestSet = true;
      this.setDestination(cell);
    }
  }

  mouseDown(cell) {
    if (this.isSourceSet && this.isDestSet) {
      this.isDragOn = true;
      document.getElementById(cell).setAttribute('style', 'background: linear-gradient(#2baebd, #2baebd) no-repeat;');
      const row = parseInt (cell.split(',')[0], 10);
      const col = parseInt (cell.split(',')[1], 10);
      this.calculatingGrid[row][col] = '0';
    }
  }
  mouseUp(cell) {
    if (this.isSourceSet && this.isDestSet) {
      this.isDragOn = false;
      console.log('dragging off');
    }
  }
  mouseMove(cell) {
    if (this.isSourceSet && this.isDestSet) {
      if (this.isDragOn) {
          console.log('dragging on ');
          document.getElementById(cell).setAttribute('style', 'background: linear-gradient(#2baebd, #2baebd) no-repeat;');
          const row = parseInt (cell.split(',')[0], 10);
          const col = parseInt (cell.split(',')[1], 10);
          this.calculatingGrid[row][col] = '0';
      }
    }
  }
  outsideBox() {
    // when mouse is dragged outside of the grid in browser
    this.isDragOn = false;
  }
  stylePathArray(pathinCellPoints) {
    for ( this.i = 0 ; this.i < pathinCellPoints.length - 1; this.i++) {
      task(this.i);
    }
    function task(i) {
      setTimeout( () => {
        document.getElementById(pathinCellPoints[i]).setAttribute('style', 'background: linear-gradient(#db53d5, #dff5f7) no-repeat;');
      }, 80 * i );
    }
  }
  stylePathSingleFill(stylePathSingleArr, callback) {
    for ( this.i = 0 ; this.i < stylePathSingleArr.length; this.i++) {
      task(this.i, stylePathSingleArr[this.i]);
    }
    callback();
    this.stylePathArray(this.pathinCellPoints);
    function task(i, cell) {
      setTimeout( () => {
        document.getElementById(cell).setAttribute('style', 'background: linear-gradient(#2baebd, #2baebd) no-repeat;');
      }, 50 * i );
    }
  }
  stylePathSingle(row, col) {
   if (row > 0 && col > 0 ) {
      const cell = '' + row + ',' + col + '';
      this.stylePathArr.push(cell);
      // document.getElementById(cell).setAttribute('style', 'background: linear-gradient(#2baebd, #2baebd) no-repeat;');
    }
  }

  setSource(cell) {
    document.getElementById(cell).setAttribute('style', 'background: linear-gradient(#e62952, #f8f5ff) no-repeat;');
    this.source = cell;
    this.calculatingGrid[this.row][this.col] = '1';
    console.log('source: ' + this.source);
  }
  setDestination(cell) {
    this.calculatingGrid[this.row][this.col] = '1';
    document.getElementById(cell).setAttribute('style', 'background: linear-gradient(#e62952, #f8f5ff) no-repeat;');
    this.destination = cell;
    console.log('dest: ' + this.destination);
  }

  getDataAfterButtonClicked() {

  }
}
