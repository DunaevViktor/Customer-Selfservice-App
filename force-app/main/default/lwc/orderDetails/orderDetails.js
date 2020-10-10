import { LightningElement, api } from 'lwc';

import ORDER_ITEM_OBJECT from '@salesforce/schema/Order_Item__c';
import DISH_FIELD from '@salesforce/schema/Order_Item__c.Dish__c';
import AMOUNT_FIELD from '@salesforce/schema/Order_Item__c.Amount__c';
import COMMENT_FIELD from '@salesforce/schema/Order_Item__c.Comment__c';
import PRICE_FIELD from '@salesforce/schema/Order_Item__c.Cost__c';

export default class OrderDetails extends LightningElement {

    @api items;
    orderItems = [];

    columns = [
        {label: 'Dish', fieldName: 'Title__c'},
        {label: 'Comment', fieldName: 'Comment__c'},
        {label: 'Amount', fieldName: 'Amount__c'},
        {label: 'Price', fieldName: 'Cost__c'}
    ];

    connectedCallback() {
        const itemsForUpdate = JSON.parse(JSON.stringify(this.items));
        itemsForUpdate.forEach((item) => {
            const orderItem = {};
            orderItem.Id = item.Id;
            orderItem.Title__c = item.Dish__r.Title__c;
            orderItem.Comment__c = item.Comment__c;
            orderItem.Amount__c = item.Amount__c;
            orderItem.Cost__c = item.Cost__c;
            this.orderItems.push(orderItem);
        })
    }

    closeModal() {
        const selectedEvent = new CustomEvent('closemodal', {detail: false});
        this.dispatchEvent(selectedEvent);
    }

    submitDetails(){
        const selectedEvent = new CustomEvent('makeorder', {detail: false});
        this.dispatchEvent(selectedEvent);
    }

}