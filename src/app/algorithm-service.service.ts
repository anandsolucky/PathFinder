import { Injectable } from '@angular/core';
import { Subject, pairs } from 'rxjs';
import { Cell } from './models/cell.model';
import { Pair } from './models/pair.model';
import { PPair } from './models/Ppair.model';
@Injectable({
  providedIn: 'root'
})
export class AlgorithmServiceService {
  buttonListener = new Subject();
  sourcePair: Pair; destPair: Pair;
  ROW: number; COL: number;
  closedList: boolean[][] = [];
  cellDetails: Cell[][] = [];
  openList = new Set<PPair>();
  gNew: number;
  hNew: number;
  fNew: number;
  foundDest = false;
  generatedPath = [];
  pathGenerateListener = new Subject();
  constructor() { }
  visualizeClicked() {
    this.buttonListener.next();
  }
  VisualbuttonClickListener() {
    return this.buttonListener.asObservable();
  }
  PathGenerateListener() {
    return this.pathGenerateListener.asObservable();
  }
  AstarSearchAlgo(grid, source, destination) {
    const sourceI = parseInt(source.split(',')[0], 10);
    const sourceJ = parseInt(source.split(',')[1], 10);
    this.sourcePair = {i: sourceI, j: sourceJ}; // setting up source value as pair
    this.ROW = grid.length;
    this.COL = grid[0].length;
    const DestI = parseInt(destination.split(',')[0], 10);
    const DestJ = parseInt(destination.split(',')[1], 10);
    this.destPair = {i: DestI, j: DestJ}; // setting up destination value as pair
    console.log('-------------------------------------------');
    console.log('source pair: ' + this.sourcePair.i + ',' + this.sourcePair.j);
    console.log('Destination pair: ' + this.destPair.i + ',' + this.destPair.j);
    console.log('ROW: ' + this.ROW + ', COL: ' + this.COL);
    // console.log(this.calculateHValue(0, 0, this.destPair));
    console.log('1 is non blocked');
    console.log('0 is blocked');
    console.log(grid);

    if (this.isValid (this.sourcePair.i, this.sourcePair.j) === false)  {
      console.log('Source is invalid');
      return;
    }

    // If the destination is out of range
    if (this.isValid (this.destPair.i, this.destPair.j) === false) {
      console.log('Destination is invalid');
      return;
    }

    // Either the source or the destination is blocked
    if (this.isUnBlocked(grid, this.sourcePair.i, this.sourcePair.j) === false ||
        this.isUnBlocked(grid, this.destPair.i, this.destPair.j) === false) {
      console.log('Source or the destination is blocked');
      console.log(grid[this.sourcePair.i][this.sourcePair.j]);
      console.log(grid[this.destPair.i][this.destPair.j]);
      return;
    }

    // If the destination cell is the same as source cell
    if (this.isDestination(this.sourcePair.i, this.sourcePair.j, this.destPair) === true) {
      console.log('We are already at the destination');
      return;
    }
    this.initializeClosedList(this.closedList);
    console.log('closedList initialized');
    this.initializeCellDetails(this.cellDetails);
    console.log('cellDetail list initialized');
    let i = this.sourcePair.i; let j = this.sourcePair.j;
    this.cellDetails[i][j].f = 0.0;
    this.cellDetails[i][j].g = 0.0;
    this.cellDetails[i][j].h = 0.0;
    this.cellDetails[i][j].parentI = i;
    this.cellDetails[i][j].parentJ = j;

    // Put the starting cell on the open list and set its
    // 'f' as 0

    this.openList.add({f: 0.0, pair: {i, j}});



    while (this.openList.size !== 0) {
      const it = this.openList.values();
      const p = it.next().value;
      this.openList.delete(p);
      // Add this vertex to the closed list
      i = p.pair.i;
      j = p.pair.j;
      this.closedList[i][j] = true;



      // ----------- 1st Successor (North) ------------
      this.processSuccessor(grid, i - 1, j, i, j, 'Straight');
      if (this.foundDest) {
        return;
      }
      // ----------- 2nd Successor (South) ------------
      this.processSuccessor(grid, i + 1, j, i, j, 'Straight');
      if (this.foundDest) {
        return;
      }
      // ----------- 3rd Successor (East) ------------
      this.processSuccessor(grid, i , j + 1, i, j, 'Straight');
      if (this.foundDest) {
        return;
      }
      // ----------- 4th Successor (West) ------------
      this.processSuccessor(grid, i, j - 1, i, j, 'Straight');
      if (this.foundDest) {
        return;
      }
      // ----------- 5th Successor (North-East) ------------
      this.processSuccessor(grid, i - 1, j + 1, i, j, 'Diagonal');
      if (this.foundDest) {
        return;
      }
      // ----------- 6th Successor (North-West) ------------

      this.processSuccessor(grid, i - 1, j - 1, i, j, 'Diagonal');
      if (this.foundDest) {
        return;
      }
      // ----------- 7th Successor (South-East) ------------
      this.processSuccessor(grid, i + 1, j + 1, i, j, 'Diagonal');
      if (this.foundDest) {
        return;
      }
      // ----------- 8th Successor (South-West) ------------
      this.processSuccessor(grid, i + 1, j - 1, i, j, 'Diagonal');
      if (this.foundDest) {
        return;
      }
      console.log(this.cellDetails);
    }
    if (this.foundDest === false) {
      console.log('Failed to find the Destination Cell');
    }
    return;
  }


  /***************************** Utility Functions ***********************************/
   isValid(row: number, col: number) {
    return (row >= 0) && (row < this.ROW) &&  (col >= 0) && (col < this.COL);
  }
  isUnBlocked(grid, row: number, col: number) {
    // Returns true if the cell is not blocked else false
    if (grid[row][col] === '1') {
      return true;
    } else {
      return false;
    }
  }
  isDestination(row, col, dest: Pair) {
    if (row === dest.i && col === dest.j) {
      return (true);
    } else {
      return (false);
    }
  }
  calculateHValue<double>(row, col, dest: Pair) {
    // Return using the distance formula
    return(Math.sqrt((row - dest.i) * (row - dest.i)
                  + (col - dest.j) * (col - dest.j)));
  }

  tracePath(cellDetails: Cell[][], dest: Pair) {
    console.log('------------------------ displaying cell details: ');
    // console.log(cellDetails);
    console.log('The path is: ');
    let row = dest.i;
    let col = dest.j;
    const Path: Pair[] = new Array();
    let topPair: Pair;
    while (!(cellDetails[row][col].parentI === row
        && cellDetails[row][col].parentJ === col )) {
      Path.push ({i: row, j: col});
      const tempRow = cellDetails[row][col].parentI;
      const tempCol = cellDetails[row][col].parentJ;
      row = tempRow;
      col = tempCol;

      // console.log('pushing: ' + row + ',' + col);
    }

    Path.push ({i: row, j: col});
    while (Path.length > 0) {
      topPair = Path.pop();
      this.generatedPath.push( topPair.i + ',' + topPair.j);
      console.log('->' + topPair.i + topPair.j);
    }
    this.pathGenerateListener.next([...this.generatedPath]);
    return;
  }
  initializeClosedList(closedList) {
    let i; let j;
    for (  i = 0; i < this.ROW; i++) {
      closedList[i] = [];
      for (  j = 0; j < this.COL; j++) {
        closedList[i][j] = false;
      }
    }
  }

  initializeCellDetails(cellDetails: Cell[][]) {
    let i; let j;
    for (  i = 0; i < this.ROW; i++) {
      cellDetails[i] = [];
      for (  j = 0; j < this.COL; j++) {
        this.cellDetails[i][j] = {f: Number.MAX_SAFE_INTEGER, g: Number.MAX_SAFE_INTEGER,
                               h: Number.MAX_SAFE_INTEGER, parentI: -1, parentJ: -1};
      }
    }
  }

  /***********************************************************************************/

  processSuccessor(grid, i: number, j: number, currI: number, currJ: number, pathType: string) {
    if (this.isValid(i, j) === true) {
      // If the destination cell is the same as the
      // current successor
      if (this.isDestination(i, j, this.destPair) === true) {
        // Set the Parent of the destination cell
        this.cellDetails[i][j].parentI = currI;
        this.cellDetails[i][j].parentJ = currJ;
        console.log('The destination cell is found');
        this.tracePath(this.cellDetails, this.destPair);
        this.foundDest = true;
        return;
      } else if (this.closedList[i][j] === false &&
        this.isUnBlocked(grid, i, j) === true) {
        if (pathType === 'Straight') { // add 1.0 for straight path and 1.44 for diagonal
          this.gNew = this.cellDetails[currI][currJ].g + 1.0;
        } else {
          this.gNew = this.cellDetails[currI][currJ].g + 1.414;
        }
        this.hNew = this.calculateHValue (i , j, this.destPair);
        this.fNew = this.gNew + this.hNew;
        if (this.cellDetails[i][j].f === Number.MAX_SAFE_INTEGER ||
          this.cellDetails[i][j].f > this.fNew) {
          this.openList.add({f: this.fNew, pair: {i, j}});
          // Update the details of this cell
          this.cellDetails[i][j].f = this.fNew;
          this.cellDetails[i][j].g = this.gNew;
          this.cellDetails[i][j].h = this.hNew;
          this.cellDetails[i][j].parentI = currI;
          this.cellDetails[i][j].parentJ = currJ;
        }
      }
    }
  }
}
