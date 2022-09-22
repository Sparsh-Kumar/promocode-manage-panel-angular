import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PromocodeStatus, PromotionType } from './types';
import { LooseObject } from './types';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  public dialogData: FormGroup;
  public title: string = 'Add Promocode';
  public btnText: string = 'Create';
  public icon: string = 'add';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: LooseObject,
    private dialogRef: MatDialogRef<DialogComponent, any>,
  ) {
    this.initializeForm();
    if (data && (data as any).editDetails) {
      this.title = 'Edit Promocode';
      this.btnText = 'Update';
      this.icon = 'edit';
      this.fill();
    }
  }

  initializeForm(): void {
    this.dialogData = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
      ]),
      discount: new FormControl(5, [
        Validators.required,
      ]),
      /** Todo: Apply more validation here */
      status: new FormControl(PromocodeStatus.ACTIVE, [
        Validators.required,
      ]),
      /** Todo: Apply more validation here */
      type: new FormControl(PromotionType.GIFT_CARD, [
        Validators.required,
      ]),
      range: new FormGroup({
        startDate: new FormControl(null, [
          Validators.required,
        ]),
        endDate: new FormControl(null, [
          Validators.required,
        ]),
      })
    });
  }

  ngOnInit(): void {
  }

  fill(): void {
    const {
      name,
      discount,
      status,
      type,
      startDate,
      endDate,
    }: {
      name: string,
      discount: number,
      status: PromocodeStatus,
      type: PromotionType,
      startDate: string,
      endDate: string,
    } = (this.data as any).editDetails;
    this.dialogData.patchValue({
      name,
      discount,
      status,
      type,
    });
    this.dialogData.get('range')?.patchValue({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
  }

  addOrEditPromocode(): void {
    if (this.dialogData.valid) {
      this.dialogRef.close({
        data: this.dialogData.value,
      });
    }
  }
}
