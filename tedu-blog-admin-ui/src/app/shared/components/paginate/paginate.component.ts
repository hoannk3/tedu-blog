import { NgFor, NgForOf, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from '../../common/constants/config';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-paginate',
    standalone: true,
    imports: [NgFor, NgForOf, NgIf],
    templateUrl: './paginate.component.html',
    styleUrl: './paginate.component.css'
})
export class PaginateComponent implements OnChanges, OnInit {
    @Input() current: number = 1;
    @Input() total: number = 0;
    @Input() showTotal: boolean = true;
    @Input() pageSize: number = config.pageSize;
    @Input() isPageSize: boolean = false;

    @Output() goTo: EventEmitter<number> = new EventEmitter<number>();
    @Output() next: EventEmitter<number> = new EventEmitter<number>();
    @Output() previous: EventEmitter<number> = new EventEmitter<number>();
    public pages: number[] = [];
    public pageEntries$: Observable<number>;
    public totalPage: number = 1;

    constructor(private store: Store<{ pageSize: number }>) {
        this.pageEntries$ = store.select('pageSize');
    }

    ngOnInit(): void {
        this.current = this.current || 1;
        this.totalPage = Math.max(1, Math.ceil(this.total / this.pageSize));
        this.pages = this.getPages(this.current, this.totalPage);

        this.pageEntries$.subscribe((value) => {
            this.pageSize = this.isPageSize ? this.pageSize : value;
            this.totalPage = Math.max(1, Math.ceil(this.total / this.pageSize));
            this.pages = this.getPages(this.current, this.totalPage);
            this.checkCurrentPage();
        });
    }

    public onGoTo(page: number): void {
        this.goTo.emit(page)
    }

    public onNext(): void {
        this.next.emit(this.current)
    }

    public onPrevious(): void {
        this.previous.next(this.current)
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (
            (changes['current'] && changes['current'].currentValue !== undefined) ||
            (changes['total'] && changes['total'].currentValue !== undefined) ||
            (changes['pageSize'] && changes['pageSize'].currentValue)
        ) {
            this.current = Math.max(1, Number(this.current));
            this.totalPage = Math.max(1, Math.ceil(this.total / this.pageSize));
            this.pages = this.getPages(this.current, this.totalPage);
            this.checkCurrentPage();
        }
    }

    private getPages(current: number, total: number): number[] {
        total = Math.max(1, total);
        current = Math.min(Math.max(1, current), total);

        if (total <= 5) {
            return [...Array(total).keys()].map(x => ++x);
        }

        if (current > 4) {
            if (current >= total - 3) {
                return [1, -1, total - 4, total - 3, total - 2, total - 1, total];
            } else {
                return [1, -1, current - 1, current, current + 1, -1, total];
            }
        }

        return [1, 2, 3, 4, 5, -1, total];
    }

    private checkCurrentPage(): void {
        this.totalPage = Math.max(1, this.totalPage);

        if (this.current > this.totalPage) {
            this.current = this.totalPage;
            this.goTo.emit(this.current);
        }

        if (this.current < 1) {
            this.current = 1;
            this.goTo.emit(this.current);
        }

        const itemsOnCurrentPage = this.total - (this.current - 1) * this.pageSize;
        if (this.current > 1 && itemsOnCurrentPage <= 0 && this.total > 0) {
            this.current = this.current - 1;
            this.goTo.emit(this.current);
        }
    }
}