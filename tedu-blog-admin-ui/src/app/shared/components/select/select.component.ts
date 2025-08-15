
import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormGroup, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropdownPosition, NgSelectModule } from '@ng-select/ng-select';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { Select2Data, Select2Option, Select2UpdateEvent, Select2Value } from 'ng-select2-component';
import { method } from '../../common/constants/config';
import { ListSelect2OptionResponse } from '../../../shared/core/models/select2/select2-option.model';
import { ApiService } from '../../core/service/api.service';

@Component({
    selector: 'app-ng-select',
    standalone: true,
    imports: [NgSelectModule, FormsModule],
    templateUrl: './select.component.html',
    styleUrl: './select.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NgSelectComponent),
            multi: true
        }
    ],
    encapsulation: ViewEncapsulation.None
})
export class NgSelectComponent implements ControlValueAccessor, OnChanges, OnInit, OnDestroy, AfterViewInit {

    @Input() data!: Select2Data;
    @Input() placeHolder!: string;
    @Input() formControlName!: string;
    @Input() form!: FormGroup;
    @Input() selectedValue!: any;
    @Input() disabled: boolean = false;
    @Input() enableSearch: boolean = true;
    @Input() value!: Select2Value;
    @Input() displaySearchStatus!: any;
    @Input() markAsDirty: boolean = true;
    @Input() clearable: boolean = false;
    @Input() dataLoading: boolean = false;
    @Input() disableSelected: boolean = false;
    @Input() dropdownPosition: DropdownPosition = 'auto';
    @Input() isLazyLoadingScroll: boolean = false;
    @Input() apiUrl: string = '';
    @Input() height: number = 0;
    @Input() appendTo: string = 'body';
    @Input() enableEnteredValue: boolean = false;
    @Input() changeData: boolean = false;
    @Input() onOpen?: () => void;
    @Input() onClose?: () => void;

    @Output() searchResult: EventEmitter<Select2Data> = new EventEmitter();
    @Output() changeValueEvent = new EventEmitter<any>();
    @Output() selectedLabelEvent: EventEmitter<any> = new EventEmitter();
    @Output() selectedValueEvent: EventEmitter<any> = new EventEmitter();
    @Output() getSearchKeyEvent: EventEmitter<string> = new EventEmitter();
    @Output() clearEvent: EventEmitter<any> = new EventEmitter();

    keyword: string = '';
    pageNum: number = 1;
    pageSize: number = 50;
    totalRecords: number = 0;
    destroy$ = new Subject<void>();
    searchSubject = new Subject<string>();

    constructor(private render: Renderer2, private el: ElementRef,
        private apiService: ApiService
    ) {

    }

    ngOnInit(): void {
        if (this.height > 0) {
            this.changeHeight();
        }

        if (this.isLazyLoadingScroll) {
            this.pageNum = 1;
            this.data = [];
            this.totalRecords = 0;
        }

        this.searchSubject
            .pipe(debounceTime(300), takeUntil(this.destroy$))
            .subscribe(() => {
                this.data = [];
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes['selectedValue'] && changes['selectedValue'].currentValue &&
            changes['selectedValue'].currentValue !== changes['selectedValue'].previousValue
        ) {
            if (changes['selectedValue'].previousValue == '') {
                const optionData = this.data as Select2Option[];
                const lableValue = optionData.find((item) =>
                    item.value === changes['selectedValue'].currentValue);
                this.form?.controls[this.formControlName].patchValue(lableValue?.value);
                this.form?.controls[this.formControlName].markAsDirty();
                this.selectedLabelEvent.emit(lableValue);
            }
            this.changeValueEvent.emit(changes['selectedValue'].currentValue);
        }
        if (this.changeData && this.data.length === 0) {
            this.dataLoading = true;
        }
        if (changes['data'] && changes['data'].currentValue && this.data.length > 0) {
            this.dataLoading = false;
            this.data = this.data.filter((item: any) => item.value !== '' && item.label !== '');
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngAfterViewInit() {
        this.applyTitlesToOptions();
    }

    writeValue(): void {
    }

    registerOnChange(): void {
    }

    registerOnTouched(): void {
    }

    onChangeValue(newValue: any) {
        this.form?.controls[this.formControlName].patchValue(newValue);
        this.changeValueEvent.emit(newValue);
    }

    onSelectedValue(event: Select2UpdateEvent) {
        const optionData = this.data as Select2Option[];
        if (event != undefined) {
            const lableValue = optionData.find((item) =>
                item.value === event.value);
            this.form?.controls[this.formControlName].patchValue(lableValue?.value);
            this.form?.controls[this.formControlName].markAsDirty();
            this.selectedLabelEvent.emit(lableValue);
        }
    }

    search(event: any) {
        this.getSearchKeyEvent.emit(event.term);
        if (this.isLazyLoadingScroll) {
            this.keyword = event.term;
            this.pageNum = 1;
            this.data = [];
            this.searchSubject.next(this.keyword);
        }
    }

    handleOpen() {
        if (this.onOpen) {
            this.onOpen();
        }

        this.applyTitlesToOptions();
        this.setDisableSelected();
    }

    handleClose() {
        if (this.onClose) {
            this.onClose();
        }
    }

    onKeydown(event: KeyboardEvent) {
        if (this.enableEnteredValue) {
            const inputElement = (event.target as HTMLInputElement);

            if (event.key === 'Enter' && inputElement.value.trim() !== '') {
                const dataExists = this.data.some(x => x.label.toLowerCase().includes(inputElement.value.trim().toLowerCase()))
                if (dataExists) {
                    return;
                }
                const newItem = { value: 0, label: inputElement.value.trim() };
                this.data = [...this.data, newItem];
                this.selectedValue = newItem.value;
                this.form?.controls[this.formControlName].patchValue(newItem);
                this.changeValueEvent.emit(newItem);
                this.selectedLabelEvent.emit(newItem);
                this.selectedValue = newItem.value;
                inputElement.value = '';
                event.preventDefault();
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

    onScrollToEnd() {
        if (!this.dataLoading && this.data.length < this.totalRecords) {
            this.pageNum++;
        }
    }

    //#region Helper
    applyTitlesToOptions() {
        setTimeout(() => {
            const options = document.querySelectorAll('.ng-option .ng-option-label');
            options.forEach(option => {
                const text = option.textContent;
                if (text) {
                    (option as HTMLElement).title = text.trim();
                }
            });
        }, 200);
    }


    changeHeight() {
        const ngSelectContainer = this.el.nativeElement.querySelector('.ng-select-container');
        if (ngSelectContainer) {
            this.render.setStyle(ngSelectContainer, 'height', `${this.height}px`);
            this.render.setStyle(ngSelectContainer, 'min-height', `${this.height}px`);
        }
    }

    setDisableStateForOptions() {
        this.data = this.data.map(item => ({
            ...item,
            disabled: this.disableSelected
        }));
    }

    setDisableSelected() {
        if (this.disableSelected) {
            setTimeout(() => {
                var dropdown = document.querySelector('.ng-dropdown-panel-items .ng-option');
                if (this.data == undefined || this.data.length === 0) {
                    if (dropdown) {
                        this.render.addClass(dropdown, 'select-option-disabled');
                    }
                } else {
                    this.setDisableStateForOptions();
                }
            });
        } else {
            setTimeout(() => {
                var dropdown = document.querySelector('.ng-dropdown-panel-items .ng-option');
                if (this.data == undefined || this.data.length === 0) {
                    if (dropdown) {
                        this.render.addClass(dropdown, 'select-option-disabled');
                    }
                }
            });
        }
    }
}