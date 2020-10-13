import { LightningElement, api, track } from 'lwc';

export default class OrderDetails extends LightningElement {

    @api items;
    @track orderItems = [];

    actions = [
        { label: 'Delete', name: 'delete' }
    ];

    columns = [
        {label: 'Dish', fieldName: 'Title__c', hideDefaultActions: true},
        {label: 'Comment', fieldName: 'Comment__c', hideDefaultActions: true},
        {label: 'Amount', fieldName: 'Amount__c', hideDefaultActions: true},
        {label: 'Price', fieldName: 'Cost__c', hideDefaultActions: true},
        {type: 'action', typeAttributes: { rowActions: this.actions, menuAlignment: 'right' }}
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

    handleRowAction(event) {
        const row = JSON.parse(JSON.stringify(event.detail.row));
    
        const selectedEvent = new CustomEvent('deleted', {detail: row.Id});
        this.dispatchEvent(selectedEvent);
    
        this.orderItems = this.orderItems.filter((orderItem) => {
            return orderItem.Id != row.Id;
        });
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