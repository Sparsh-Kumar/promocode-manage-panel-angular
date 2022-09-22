import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  @Input() public matIconVisible: boolean = false;
  @Input() public matIcon: string = 'supervised_user_circle';

  @Input() public matTextVisible: boolean = false;
  @Input() public matText: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
