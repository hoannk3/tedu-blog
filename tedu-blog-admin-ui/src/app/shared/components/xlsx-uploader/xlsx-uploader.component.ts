import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../common/utils/toast.service';
import { commonMessage } from '../../common/message/message';
import { fileExtension } from '../../common/constants/config';

@Component({
  selector: 'app-xlsx-uploader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './xlsx-uploader.component.html',
  styleUrl: './xlsx-uploader.component.css'
})
export class XlsxUploaderComponent {
  @Input() label: string | undefined;
  @Input() disabled: boolean = false;
  @Input() allowAllFiles: boolean = false;
  @Input() justifyContent: string = 'flex-start';
  @Output() loadData: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  constructor(private toastService: ToastService) { }

  onUploadClick(): void {
    this.fileInput.nativeElement.click();
  }

  onFileInputClick(): void {
    this.fileInput.nativeElement.value = '';
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (!file.name.endsWith(fileExtension.xslx) && !this.allowAllFiles) {
        this.toastService.showToastError(commonMessage.MID_ERR_010);
        input.value = '';
        return;
      }
      this.loadData.emit(file);
    }
  }
}
