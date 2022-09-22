import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LooseObject } from './types/types';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @Input() public displayedColumns: string[] = [];
  @Input() public dataSource: LooseObject[] = [];
  @Output() public deletePromocodeEvent = new EventEmitter();
  @Output() public editPromocodeEvent = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  public editPromocode(promoId: string) {;
    this.editPromocodeEvent.emit(promoId);
  }

  public deletePromocode(promoId: string) {
    this.deletePromocodeEvent.emit(promoId);
  }
}
