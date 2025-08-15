import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class ModalService {
    private modals: Map<string, any> = new Map();
    constructor() { }

    registerModal(id: string, modal: any) {
        this.modals.set(id, modal);
    }

    unregisterModal(id: string) {
        this.modals.delete(id);
    }

    open(id: string) {
        const modal = this.modals.get(id);
        if (modal) {
            modal.show();
        } else {
            console.error(`Modal with id ${id} not found`);
        }
    }

    hide(id: string) {
        const modal = this.modals.get(id);
        if (modal) {
            modal.hide();
        } else {
            console.error(`Modal with id ${id} not found`);
        }
    }
}