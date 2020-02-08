import { Component, OnInit } from '@angular/core';
import { AlgorithmServiceService } from '../algorithm-service.service';

@Component({
  selector: 'app-path-finder',
  templateUrl: './path-finder.component.html',
  styleUrls: ['./path-finder.component.css']
})
export class PathFinderComponent implements OnInit {
  rows = [];
  cols = [];
  grid = [];
  calculatingGrid = [];
  first = true;
  dest = true;
  source;
  destination;
  i: number;
  j: number;
  gridSize = 9;
  pathInAlphabet = [];
  pathinCellPoints = [];
  sourceRow: number;
  sourceCol: number;
  stylePathArr = [];
  constructor(private algorithmService: AlgorithmServiceService) {

    for ( this.i = 0; this.i <= this.gridSize; this.i++) {
      this.grid[this.i] = [];
      for ( this.j = 0; this.j <= this.gridSize + 12; this.j++ ) {
          this.grid[this.i][this.j] = '' + this.i + ',' + this.j + '';
        }
    }
    for ( this.i = 0; this.i <= this.gridSize; this.i++) {
      console.log(this.grid[this.i]);
    }
    this.calculatingGrid = [...this.grid];
    for ( this.i = 0; this.i <= this.gridSize; this.i++) {
      this.calculatingGrid[this.i] = [];
      for ( this.j = 0; this.j <= this.gridSize + 12; this.j++ ) {
          this.calculatingGrid[this.i][this.j] = 'Empty';
        }
    }
  }
  ngOnInit() {
  }
  onClick(cell) {
    if (this.first) {
      this.first = false;
      document.getElementById(cell).setAttribute('style', 'background: linear-gradient(#e62952, #f8f5ff) no-repeat;');
      this.source = cell;
      // tslint:disable-next-line: radix
      this.sourceRow = parseInt (cell.split(',')[0]);
      // tslint:disable-next-line: radix
      this.sourceCol = parseInt (cell.split(',')[1]);
      this.calculatingGrid[this.sourceRow][this.sourceCol] = 'Start';
      console.log('source: ' + this.source);
    } else if (this.dest) {
      this.dest = false;
      this.destination = cell;
      // tslint:disable-next-line: radix
      const row = parseInt (cell.split(',')[0]);
      // tslint:disable-next-line: radix
      const col = parseInt (cell.split(',')[1]);
      this.calculatingGrid[row][col] = 'Goal';
      document.getElementById(cell).setAttribute('style', 'background: linear-gradient(#e62952, #f8f5ff) no-repeat;');
      console.log('dest: ' + this.destination);

      this.pathInAlphabet = this.findShortestPath([this.sourceRow, this.sourceCol], this.calculatingGrid);
      console.log('soruce row col ' + this.sourceRow + this.sourceCol);
      console.log('destination row col ' + row + col);
      console.log('path in alpha: ' + this.pathInAlphabet + 'len: ' + this.pathInAlphabet.length);
      this.pathinCellPoints = this.findPathInCell(this.pathInAlphabet, this.calculatingGrid, this.sourceRow, this.sourceCol);
      // console.log('path in points: ' + this.pathinCellPoints);
      this.stylePathSingleFill(this.stylePathArr, () => {
        this.stylePathArray(this.pathinCellPoints);
      });
    }
  }

  stylePathArray(pathinCellPoints) {
    for ( this.i = 0 ; this.i < pathinCellPoints.length - 1; this.i++) {
      task(this.i);
    }
    function task(i) {
      setTimeout( () => {
        document.getElementById(pathinCellPoints[i]).setAttribute('style', 'background: linear-gradient(#dff5f7, #dff5f7) no-repeat;');
      }, 500 * i );
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

  findPathInCell(pathInAlphabet, calculatingGrid, sourceRow, sourceCol) {
    const pathInPoints = [];
    for ( this.i = 0 ; this.i < pathInAlphabet.length; this.i++) {
      if (pathInAlphabet[this.i] === 'South') {
        sourceRow += 1;
        pathInPoints.push('' + sourceRow + ',' + sourceCol);
      }
      if (pathInAlphabet[this.i] === 'North') {
        sourceRow -= 1;
        pathInPoints.push('' + sourceRow + ',' + sourceCol);
      }
      if (pathInAlphabet[this.i] === 'West') {
        sourceCol -= 1;
        pathInPoints.push('' + sourceRow + ',' + sourceCol);
      }
      if (pathInAlphabet[this.i] === 'East') {
        sourceCol += 1;
        pathInPoints.push('' + sourceRow + ',' + sourceCol);
      }
    }
    return pathInPoints;
  }
  /****************** Find Shortest Path  *********************** */

  findShortestPath(startCoordinates, grid) {
    const distanceFromTop = startCoordinates[0];
    const distanceFromLeft = startCoordinates[1];

    // Each "location" will store its coordinates
    // and the shortest path required to arrive there
    const location = {
      distanceFromTop,
      distanceFromLeft,
      path: [],
      status: 'Start'
    };
    // console.log('location: ' + location.distanceFromLeft);

    const queue = [location];

  // Loop through the grid searching for the goal
    while (queue.length > 0) {
      console.log('qlen: ' + queue.length);
     // Take the first location off the queue
      const currentLocation = queue.shift();
      let newLocation;
      // Explore North
      newLocation = this.exploreInDirection(currentLocation, 'North', grid);
      if (newLocation.status === 'Goal') {
        return newLocation.path;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);
      }

      // Explore East
      newLocation = this.exploreInDirection(currentLocation, 'East', grid);
      if (newLocation.status === 'Goal') {
        return newLocation.path;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);
      }

      // Explore South
      newLocation = this.exploreInDirection(currentLocation, 'South', grid);
      if (newLocation.status === 'Goal') {
        return newLocation.path;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);
      }

      // Explore West
      newLocation = this.exploreInDirection(currentLocation, 'West', grid);
      if (newLocation.status === 'Goal') {
        return newLocation.path;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);
      }
      this.stylePathSingle(newLocation.distanceFromTop, newLocation.distanceFromLeft);
    }
    // No valid path founds
    return false;
  }

  /******************************* Explore in direction ************************************** */

  exploreInDirection(currentLocation, direction, grid) {
    const newPath = currentLocation.path.slice();
    newPath.push(direction);
    let dft = currentLocation.distanceFromTop;
    let dfl = currentLocation.distanceFromLeft;
    if (direction === 'North') {
      dft -= 1;
    } else if (direction === 'East') {
      dfl += 1;
    } else if (direction === 'South') {
      dft += 1;
    } else if (direction === 'West') {
      dfl -= 1;
    }

    const newLocation = {
      distanceFromTop: dft,
      distanceFromLeft: dfl,
      path: newPath,
      status: 'Unknown'
    };

    newLocation.status = this.locationStatus(newLocation, grid);

    // If this new location is valid, mark it as 'Visited'
    if (newLocation.status === 'Valid') {
      grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = 'Visited';
    }
    return newLocation;
  }


  /*************************** Location Status function ************************ */

  locationStatus(location, grid) {
    const gridSize = grid.length;
    const dft = location.distanceFromTop;
    const dfl = location.distanceFromLeft;
    if (location.distanceFromLeft < 0 ||
        location.distanceFromLeft >= gridSize ||
        location.distanceFromTop < 0 ||
        location.distanceFromTop >= gridSize) {

      // location is not on the grid--return false
      return 'Invalid';
    } else if (grid[dft][dfl] === 'Goal') {
      return 'Goal';
    } else if (grid[dft][dfl] !== 'Empty') {
      // location is either an obstacle or has been visited
      return 'Blocked';
    } else {
      return 'Valid';
    }
  }


}
