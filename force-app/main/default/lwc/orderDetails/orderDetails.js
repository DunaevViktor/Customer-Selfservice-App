import { LightningElement, api } from 'lwc';

import ORDER_ITEM_OBJECT from '@salesforce/schema/Order_Item__c';
import DISH_FIELD from '@salesforce/schema/Order_Item__c.Dish__c';
import AMOUNT_FIELD from '@salesforce/schema/Order_Item__c.Amount__c';
import COMMENT_FIELD from '@salesforce/schema/Order_Item__c.Comment__c';
import PRICE_FIELD from '@salesforce/schema/Order_Item__c.Cost__c';

export default class OrderDetails extends LightningElement {

    @api items;
    orderItems = [];

    //Title?
    columns = [
        {label: 'Dish', fieldName: 'Dish__r.Title__c'},
        {label: 'Comment', fieldName: 'Comment__c'},
        {label: 'Amount', fieldName: 'Amount__c'},
        {label: 'Price', fieldName: 'Cost__c'}
    ];

    connectedCallback() {
        this.orderItems = JSON.parse(JSON.stringify(this.items));
        console.log(this.orderItems);
    }

    closeModal() {
        const selectedEvent = new CustomEvent('closemodal', {detail: false});
        this.dispatchEvent(selectedEvent);
    }

    submitDetails(){
        console.log('For test.');
    }

}