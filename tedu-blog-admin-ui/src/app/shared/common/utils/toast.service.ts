import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    constructor(private toastr: ToastrService) {
    }

    showToastSuccess(message: string): void {
        this.toastr.success(this.addDotToMessage(message));
    }

    showToastError(message: string): void {
        this.toastr.error(this.addDotToMessage(message));
    }

    showToastWarning(message: string): void {
        this.toastr.warning(this.addDotToMessage(message));
    }

    showToastInfo(message: string): void {
        this.toastr.info(this.addDotToMessage(message));
    }

    private addDotToMessage(message: any): string {
        if (typeof message === 'object' && message.title !== undefined) {
            return message.title.endsWith('。') ? message.title : message.title + '。';
        }
        if (typeof message === 'string') {
            return message.endsWith('。') ? message : message + '。';
        }
        return message;
    }
}