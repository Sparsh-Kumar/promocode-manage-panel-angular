import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Observable, throwError } from 'rxjs';
import { HttpHeaders, HttpErrorResponse, HttpClient, HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { LooseObject, PromocodeStatus } from './types';

@Injectable({
  providedIn: 'root'
})
export class PromocodesService {

  private _baseURL: string = 'promocodes';

  constructor(
    private _httpClient: HttpClient,
  ) { }

  public getPromocodes(formDetails: FormGroup) {
    let params = new HttpParams();
    if (formDetails.value.searchTerm) {
      params = params.append('searchTerm', formDetails.value.searchTerm);
    }
    if (formDetails.value.status) {
      params = params.append('status', formDetails.value.status);
    }
    if (formDetails.value.limit) {
      params = params.append('limit', formDetails.value.limit);
    }
    if (formDetails.value.page) {
      params = params.append('page', formDetails.value.page);
    }
    return this._httpClient.get(`${environment.API_URL}/${this._baseURL}`, {
      params
    });
  }

  public getPromocode(promoId: string) {
    return this._httpClient.get(`${environment.API_URL}/${this._baseURL}/${promoId}`);
  }

  public createNewPromocode(promocodeDetails: LooseObject) {
    (promocodeDetails as any).startDate = (promocodeDetails as any).range.startDate.toJSON();
    (promocodeDetails as any).endDate = (promocodeDetails as any).range.endDate.toJSON();
    delete promocodeDetails['range'];
    return this._httpClient.post(`${environment.API_URL}/${this._baseURL}`, promocodeDetails);
  }

  public editPromocode(promoId: string, promocodeDetails: LooseObject) {
    (promocodeDetails as any).startDate = (promocodeDetails as any).range.startDate.toJSON();
    (promocodeDetails as any).endDate = (promocodeDetails as any).range.endDate.toJSON();
    delete promocodeDetails['range'];
    return this._httpClient.patch(`${environment.API_URL}/${this._baseURL}/${promoId}`, promocodeDetails);
  }

  public deletePromocode(promoId: string) {
    return this._httpClient.delete(`${environment.API_URL}/${this._baseURL}/${promoId}`);
  }
}
