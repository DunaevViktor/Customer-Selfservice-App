import { LightningElement, api, track } from 'lwc';

export default class OrderDetails extends LightningElement {

    @api items;
    @track orderItems = [];

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

    get isEmpty() {
        return this.orderItems.length == 0;
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