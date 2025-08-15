import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { UtilsService } from './utils.service';
import { commonMessage } from '../message/message';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(
    private router: Router,
    private utilsService: UtilsService
  ) { }

  popupBack(
    title: string, message: string,
    route?: string | Array<string | number>,
    queryParams: any = {}
  ): void {
    Swal.fire({
      title: title,
      html: message,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: "キャンセル"
    }).then((result) => {
      if (result.isConfirmed && route) {
        this.router.navigate(
          route instanceof Array ? route : [route],
          { queryParams: queryParams }
        );

        this.utilsService.setFormState(false);
      }
    });
  }

  popupDelete(
    title: string = commonMessage.MID_WRN_003,
    message: string = commonMessage.MID_WRN_004
  ): Promise<SweetAlertResult> {
    return Swal.fire({
      title: title,
      html: message,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: "キャンセル"
    });
  }

  popupDeleteRelation(
    title: string = commonMessage.MID_WRN_003,
    message: string = commonMessage.MID_WRN_005
  ): Promise<SweetAlertResult> {
    return Swal.fire({
      title: title,
      html: message,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: "キャンセル"
    });
  }

  popupSuccess(title: string, message: string): void {
    Swal.fire({
      title: title,
      html: message,
      icon: 'success'
    });
  }

  popupConfirm(
    title: string,
    message: string,
    showCancelButton: boolean = true
  ): Promise<SweetAlertResult> {
    return Swal.fire({
      title: title,
      html: message,
      icon: 'warning',
      showCancelButton: showCancelButton,
      cancelButtonText: "キャンセル"
    });
  }
}
