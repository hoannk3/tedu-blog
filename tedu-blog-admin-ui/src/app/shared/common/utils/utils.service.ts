import { Injectable, Injector } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { Sort } from "../../core/models/base/base-request.model";
import { commonMessage } from "../message/message";
import { PopupService } from "./popup.service";

declare let $: any;
@Injectable({
    providedIn: 'root'
})
export class UtilsService {
    private formState = new BehaviorSubject<boolean>(false);
    private defaultFormState: any;
    private popupService: PopupService | undefined;

    constructor(public injector: Injector) { }

    getMessage(messageCode: string, ...params: string[]): string {
        const template = commonMessage[messageCode as keyof typeof commonMessage];
        if (!template) {
            throw new Error(`メッセージコード ${messageCode} 見つかりません`);
        }

        if (params.length === 0) {
            return template;
        }

        return params.reduce((result, value, index) => {
            const placeholder = `{${index}}`;
            return result.replace(placeholder, value);
        }, template);
    }

    setUrlValueParams(url: string, params: any) {
        if (Object.keys(params).length === 0) {
            return url;
        }
        const arrayParams = url.split('/');
        const symbols = ['$', ':'];
        let index = 0;
        const finalParams: Array<any> = [];
        arrayParams.forEach(function (value, key) {
            if (symbols.includes(value.charAt(0))) {
                const paramKey: any = Object.keys(params)[index];
                if (paramKey) {
                    finalParams[key] = params[paramKey];
                }
                ++index;
            } else {
                finalParams[key] = value;
            }
        });

        return finalParams.join('/');
    }

    sortTable(e: any, key: string): Sort {
        const target = $(e.target);
        const equal: Sort = { 'field': key, 'is_desc': false };
        $(e.target).siblings().removeClass('sorting_asc').removeClass('sorting_desc');
        if (target.hasClass('sorting_asc')) {
            $(e.target).addClass('sorting_desc').removeClass('sorting_asc');
            equal.is_desc = true;
        } else if (target.hasClass('sorting_desc')) {
            $(e.target).addClass('sorting_asc').removeClass('sorting_desc');
            equal.is_desc = false;
        } else {
            $(e.target).addClass('sorting_desc').removeClass('sorting_asc');
            equal.is_desc = true;
        }

        return equal;
    }

    isHaftWidth(chars: string): boolean {
        for (let i = 0, l = chars.length; i < l; i++) {
            const c = chars[i].charCodeAt(0);
            if (c - 0xfee0 < 0) {
                return false;
            }
        }
        return true;
    }

    getChangedValues(form: FormGroup) {
        return Object.keys(form.controls)
            .filter(key => form.controls[key].dirty)
            .reduce((obj: { [key: string]: any }, key) => {
                const camelKey = key.replace(/(_\w)/g, m => m[1].toUpperCase());
                obj[camelKey] = form.controls[key].value;
                return obj;
            }, {});
    }

    setFormState(state: boolean) {
        this.formState.next(state);
    }

    getCurrentFormState() {
        return this.formState.value;
    }

    setDefaultFormState(defaultState: any) {
        this.defaultFormState = defaultState;
    }

    onFormChange(changeFormState: any) {
        if (this.isFormChanged(changeFormState)) {
            this.setFormState(true);
        } else {
            this.setFormState(false);
        }
    }

    resetDefaultFormState() {
        this.formState.next(false);
    }

    async popupConfirmChange(): Promise<boolean> {
        if (!this.popupService) {
            this.popupService = this.injector.get(PopupService);
        }

        const result = await this.popupService.popupConfirm(
            commonMessage.MID_WRN_002,
            commonMessage.MID_INF_002
        );
        if (result.isConfirmed) {
            return true;
        } else {
            return false;
        }
    }

    private isFormChanged(changeFormState: any): boolean {
        if (!this.defaultFormState || !changeFormState) {
            return false;
        }

        for (const key in this.defaultFormState) {
            if (this.defaultFormState.hasOwnProperty(key)) {
                if (this.defaultFormState[key] !== changeFormState[key]) {
                    return true;
                }
            }
        }
        return false;
    }

    generateRandomId(length: number) {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    formatString(message: string, ...values: any[]) {
        return message.replace(/{(\d+)}/g, (match, index) => {
            return typeof values[index] !== "undefined" ? values[index] : match;
        });
    }

    deepClone<T>(obj: T): T {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        if (obj instanceof Date) {
            return new Date(obj.getTime()) as T;
        }

        if (obj instanceof Map) {
            return new Map([...obj.entries()].map(([key, value]) => [key, this.deepClone(value)])) as T;
        }

        if (obj instanceof Set) {
            return new Set([...obj].map(value => this.deepClone(value))) as T;
        }

        if (Array.isArray(obj)) {
            return obj.map(item => this.deepClone(item)) as T;
        }

        const clonedObj: any = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = this.deepClone(obj[key]);
            }
        }

        return clonedObj as T;
    }

    cleanModalLink(url: string): string {
        if (url.endsWith('#modal')) {
            return url.replace('#modal', '').trim();
        }
        return '';
    }
}