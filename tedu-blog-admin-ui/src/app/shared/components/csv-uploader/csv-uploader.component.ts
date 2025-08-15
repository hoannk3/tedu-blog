import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ToastService } from '../../common/utils/toast.service';
import { fileExtension } from '../../common/constants/config';
import { commonMessage } from '../../common/message/message';

@Component({
  selector: 'app-csv-uploader',
  standalone: true,
  imports: [],
  templateUrl: './csv-uploader.component.html',
  styleUrl: './csv-uploader.component.css'
})
export class CsvUploaderComponent {
  @Input() label: string | undefined;
  @Input() header: boolean = true;
  @Output() csvDataLoaded: EventEmitter<any[]> = new EventEmitter<any[]>();
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  csvData: any[] = [];
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
      if (!file.name.endsWith(fileExtension.csv)) {
        this.toastService.showToastError(commonMessage.MID_ERR_007);
        input.value = '';
        return;
      }
      this.readFile(file);
    }
  }

  readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const csvText = reader.result as string;
      this.csvData = this.parseCSV(csvText, { header: this.header });
      this.csvDataLoaded.emit(this.csvData);
    };
    reader.readAsText(file);
  }

  parseCSV(data: string, options: { header: boolean }, delimiter: string = ','): any[] {
    const lines = data.trim().split('\n');
    const result = [];
    let startIndex = options.header ? 0 : 1;
    if (options.header) {
      const headerLine = lines[0].split(delimiter).map(item => item.trim());

      for (let i = startIndex + 1; i < lines.length; i++) {
        const currentLine = lines[i].split(delimiter);
        const result: { [key: string]: any }[] = [];

        // Then your code will work as expected
        if (currentLine.length > 0 && currentLine.join('') !== headerLine.join('')) {
          const obj: { [key: string]: any } = {};
          for (let j = 0; j < headerLine.length; j++) {
            obj[headerLine[j]] = currentLine[j];
          }
          result.push(obj); // This will now work
        }
      }
    } else {
      for (let i = startIndex; i < lines.length; i++) {
        const currentLine = lines[i].split(delimiter);
        const result: { [key: string]: any }[] = [];
        if (currentLine.length > 0) {
          result.push(currentLine);
        }
      }
    }

    return result;
  }
}
