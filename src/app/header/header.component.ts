import { Component, OnInit } from '@angular/core';
import { AlgorithmServiceService } from '../algorithm-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private algorithmService: AlgorithmServiceService) { }

  ngOnInit() {
  }
  refresh() {
    window.location.reload();
  }
  visualiseClick() {
    this.algorithmService.visualizeClicked();
  }
}
