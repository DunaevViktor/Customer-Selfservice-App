import { LightningElement, api, track } from 'lwc';

import LOCALE from '@salesforce/i18n/locale';
import CURRENCY from '@salesforce/i18n/currency';

import category from '@salesforce/label/c.category';
import description from '@salesforce/label/c.description';
import price from '@salesforce/label/c.price';
import addToOrderBtn from '@salesforce/label/c.addToOrderBtn';

export default class MenuItem extends LightningElement {

    label = {
        category,
        description,
        price,
        addToOrderBtn
    }

    @api dish;

    @track formattedPrice;

    connectedCallback() {
        this.formattedPrice = new Intl.NumberFormat(LOCALE, {
            style: 'currency',
            currency: CURRENCY,
            currencyDisplay: 'symbol'
        }).format(this.dish.Price__c);
    }

    handleClick(){
        const selectedEvent = new CustomEvent('choosed', {detail: this.dish});
        this.dispatchEvent(selectedEvent);
    }
    
}