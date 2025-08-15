import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ModalService } from "../../common/utils/modal.service";
declare let bootstrap: any;

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [],
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.css'
})

export class ModalComponent implements OnInit {
    @Input() id!: string;
    @Input() titleApp!: string;
    @Input() changeFooter: boolean = false;
    @Input() width!: string;
    @Input() isStaticBackdrop: boolean = false;
    @Output() onConfirm: EventEmitter<void> = new EventEmitter();

    private bootstrapModalInstance: any;
    constructor(private el: ElementRef, private modalService: ModalService) { }

    ngOnInit() {
        const modalElement = this.el.nativeElement.querySelector('.modal');
        this.bootstrapModalInstance = new bootstrap.Modal(modalElement, this.isStaticBackdrop ? {
            backdrop: 'static',
            keyboard: false
        } : {});
        this.modalService.registerModal(this.id, this.bootstrapModalInstance);
    }

    ngOnDestroy() {
        this.modalService.unregisterModal(this.id);
    }

    confirm() {
        this.onConfirm.emit();
    }
}