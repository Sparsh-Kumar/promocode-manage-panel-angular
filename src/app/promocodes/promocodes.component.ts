import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { LooseObject } from '../shared/table/types/types';
import { PromocodesService } from './promocodes.service';
import { PaginationDetails, PromocodeStatus } from './types';

@Component({
  selector: 'app-promocodes',
  templateUrl: './promocodes.component.html',
  styleUrls: ['./promocodes.component.css']
})
export class PromocodesComponent implements OnInit {

  public matIconVisible: boolean;
  public matIcon: string;

  public matTextVisible: boolean;
  public matText: string;

  public title: string;

  public displayedColumns: string[] = [
    'name',
    'discount',
    'status',
    'type',
    'startDate',
    'endDate',
    'action',
  ];
  public dataSource: LooseObject[] = [];
  public paginationDetails: PaginationDetails;

  public formData: FormGroup;

  public debounce: any = null;

  public startIdx: number = 0;
  public endIdx: number = 0;
  public totalIdx: number = 0;

  public isPrevDisabled: boolean = false;
  public isNextDisabled: boolean = false;

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _promocodesService: PromocodesService
  ) {

    this.matIconVisible = true;
    this.matIcon = 'favorite';

    this.matTextVisible = true;
    this.matText = 'Crud App';

    this.title = 'Promotion Code';

    this.formData = new FormGroup({
      searchTerm: new FormControl('', []),
      status: new FormControl(PromocodeStatus.ACTIVE, []),
      limit: new FormControl(5, []),
      page: new FormControl(1, []),
    });

  }

  ngOnInit(): void {
    this.getPromocodes();
  }

  public getPromocodes(): void {
    if (this.formData.valid) {
      this._promocodesService.getPromocodes(this.formData).subscribe((response: LooseObject) => {
        this.dataSource = (response as any).promocodes;
        this.paginationDetails = (response as any).pagination;

        if (!this.paginationDetails.previous) {
          this.isPrevDisabled = true;
        } else {
          this.isPrevDisabled = false;
        }

        if (!this.paginationDetails.next) {
          this.isNextDisabled = true;
        } else {
          this.isNextDisabled = false;
        }

        if (this.paginationDetails && this.paginationDetails.current) {
          this.startIdx = (this.paginationDetails.current?.page - 1 ) * this.paginationDetails.current?.limit;
          this.endIdx = this.dataSource.length;
          this.totalIdx = (this.paginationDetails as any)?.totalDocs;
        }
      }, (error) => {
        Swal.fire(
          'Error !',
          'Cannot get Promocode Details.',
          'error'
        );
      });
    }
  }

  public createNewPromocode(): void {
    const $self = this;
    const dialogReference:MatDialogRef<DialogComponent, LooseObject> = this._dialog.open(DialogComponent, {
      width: '20%',
      data: {
        editDetails: false,
      },
    });
    dialogReference.afterClosed().subscribe((result: LooseObject | undefined) => {
      const data = result && result['data']? (result as any).data: undefined;
      if (data) {
        this._promocodesService.createNewPromocode(data).subscribe((response: LooseObject) => {
          Swal.fire({
            icon: 'success',
            title: 'Successfully Added Promocode.',
            showConfirmButton: true,
          }).then(() => {
            $self.getPromocodes();
          });
        }, (error) => {
          Swal.fire(
            'Error !',
            'Cannot Add New Promocode.',
            'error',
          );
        });
      }
    });
  }

  public editPromocode(promoId: string) {
    const $self = this;
    this._promocodesService.getPromocode(promoId).subscribe((response: LooseObject) => {
      const dialogReference: MatDialogRef<DialogComponent, LooseObject> = this._dialog.open(DialogComponent, {
        width: '20%',
        data: {
          editDetails: response,
        }
      });
      dialogReference.afterClosed().subscribe((result: LooseObject | undefined) => {
        const data = result && result['data']? (result as any).data: undefined;
        this._promocodesService.editPromocode(promoId, data).subscribe((response: LooseObject) => {
          Swal.fire({
            icon: 'success',
            title: 'Successfully Edited Promocode.',
            showConfirmButton: true,
          }).then(() => {
            $self.getPromocodes();
          })
        }, (error) => {
          Swal.fire(
            'Error !',
            'Cannot Edit Promocode.',
            'error',
          );
        });
      });
    }, (error) => {
      Swal.fire(
        'Error !',
        'Cannot Retrieve Promocode Data.',
        'error'
      );
    });
  }

  public deletePromocode(promoId: string) {
    const $self = this;
    Swal.fire({
      title: 'Are you sure ?.',
      text: 'You would not be able to revert this !.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it !.',
    }).then((result) => {
      if (result.isConfirmed) {
        this._promocodesService.deletePromocode(promoId).subscribe((response: LooseObject) => {
          Swal.fire({
            icon: 'success',
            title: 'Successfully deleted Promocode.',
            showConfirmButton: true,
          }).then(() => {
            $self.getPromocodes();
          });
        }, (error) => {
          Swal.fire(
            'Error !',
            'Cannot Delete Promocode.',
            'error',
          )
        });
      }
    });
  }

  public search(): void {
    if (this.debounce) {
      clearTimeout(this.debounce);
    }
    this.debounce = setTimeout(() => {
      this.getPromocodes();
      this.debounce = null;
    }, 500);
  }

  public refreshPromoList(): void {
    this.getPromocodes();
  }

  public resetForm(): void {
    this.formData.patchValue({
      searchTerm: '',
      status: PromocodeStatus.ACTIVE,
      limit: 10,
    });
    this.getPromocodes();
  }

  public previous(): void {
    const currentPage = this.formData.get('page')?.value;
    if (currentPage > 1) {
      this.formData.patchValue({ page: currentPage - 1 });
      this.getPromocodes();
    }
  }

  public next(): void {
    const currentPage = this.formData.get('page')?.value;
    this.formData.patchValue({ page: currentPage + 1 });
    this.getPromocodes();
  }
}
