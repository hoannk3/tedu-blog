import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import {
  MtxCalendarView,
  MtxDatetimepicker,
  MtxDatetimepickerInput,
  MtxDatetimepickerMode,
  MtxDatetimepickerToggle,
  MtxDatetimepickerType,
} from '@ng-matero/extensions/datetimepicker';
import moment from 'moment';
import 'moment/locale/ja';
import { CommonModule } from '@angular/common';
import { provideMomentDatetimeAdapter } from '@ng-matero/extensions-moment-adapter';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { MatInput } from '@angular/material/input';
import { MatInputModule } from '@angular/material/input';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-datetime-picker',
  standalone: true,
  imports: [FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormField,
    MatInput,
    MatSuffix,
    MtxDatetimepicker,
    MtxDatetimepickerInput,
    MtxDatetimepickerToggle, MatInputModule, MatFormFieldModule],
  templateUrl: './datetime-picker.component.html',
  styleUrl: './datetime-picker.component.css',
  providers: [
    provideMomentDatetimeAdapter({
      parse: {
      },
      display: {
        dateInput: 'YYYY/MM/DD',
        monthInput: 'MMMM',
        yearInput: 'YYYY',
        timeInput: 'HH:mm',
        datetimeInput: 'YYYY/MM/DD HH:mm',
        monthYearLabel: 'YYYY MMMM',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
        popupHeaderDateLabel: 'MM月DD日, ddd',
      },
    }),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'ja-JP'
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic'
      }
    }
  ]
})
export class DateTimePickerComponent implements ControlValueAccessor, OnChanges {
  @ViewChild('datetimePicker') datetimePicker: any;
  @Input() minDate!: Date;
  @Input() maxDate!: Date;
  @Input() typeDate!: MtxDatetimepickerType;
  @Input() formControlName!: string;
  @Input() form!: FormGroup;
  @Input() isDisabled: boolean = false;
  @Input() selectedValue!: any;
  @Input() clear: boolean = false;
  @Input() startView: MtxCalendarView = 'month';
  @Input() isCheckInput: boolean = false;
  @Output() isCheckInputChange = new EventEmitter<boolean>();
  @Output() clearEvent: EventEmitter<any> = new EventEmitter();

  type: MtxDatetimepickerType = 'datetime';
  mode: MtxDatetimepickerMode = 'auto';
  multiYearSelector = true;
  touchUi = false;
  twelvehour = true;
  timeInterval = 1;
  timeInput = true;
  datetime = new UntypedFormControl();

  constructor() {
  }

  public onChange: any = () => { };

  private onTouched: any = () => { };

  ngOnChanges(changes: SimpleChanges): void {
    const control = this.form?.controls[this.formControlName];
    if (
      changes['selectedValue'] && changes['selectedValue'].currentValue &&
      changes['selectedValue'].currentValue !== changes['selectedValue'].previousValue
    ) {
      if (changes['selectedValue'].previousValue != null) {
        control.markAsDirty();
      }
    } else {
      if (control && !control.dirty) {
        control.markAsPristine();
      }
    }
  }


  writeValue(value: any): void {
    this.selectedValue = this.form.get(this.formControlName)?.value || null;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
  }

  onBlur() {
    this.onTouched();
    this.form.get(this.formControlName)?.markAsTouched();
    this.form.get(this.formControlName)?.updateValueAndValidity();
  }

  onOpen() {
    if (!this.isDisabled) {
      this.datetimePicker.open();
    }
  }

  handleDateTimePicked(value: any) {
    this.isCheckInputChange.emit(false);
    const control = this.form.get(this.formControlName);
    const dateTimeValue = new Date(JSON.stringify(value).replaceAll('"', ''));
    if (control && this.typeDate === 'time') {
      const timeOnly = moment(dateTimeValue).format('HH:mm');
      control.setValue(timeOnly);
      control.markAsTouched();
    }
    if (control && this.typeDate === 'date') {
      const dateOnly = moment(dateTimeValue).format('YYYY-MM-DD');
      control.setValue(dateOnly);
      control.markAsTouched();
    }
  }

  handleEditText(event: any) {
    const control = this.form.get(this.formControlName);
    if (control) {
      if (this.typeDate === 'time') {
        const parsedTime = moment(event.target.value, ['HH:mm', 'HH:mm:ss'], true);
        if (parsedTime.isValid()) {
          const timeOnly = moment(parsedTime).format('HH:mm');
          this.selectedValue = timeOnly;
          control.setValue(timeOnly);
          control.markAsTouched();
        } else {
          control.setValue(event.target.value);
          control.markAsTouched();
        }
      }

      if (this.typeDate === 'date') {
        if (this.selectedValue !== null) {
          const parsedDate = new Date(this.selectedValue);
          if (!isNaN(parsedDate.getTime())) {
            const dateOnly = moment(parsedDate).format('YYYY-MM-DD');
            this.selectedValue = parsedDate;
            control.setValue(dateOnly);
            control.markAsTouched();
          }
        } else {
          control.setValue(event.target.value);
          control.markAsTouched();
        }
      }
    }
  }

  onClear() {
    if (this.form && this.formControlName) {
      this.form.get(this.formControlName)?.setValue(null);
    } else {
      this.clearEvent.emit();
    }
  }
}
