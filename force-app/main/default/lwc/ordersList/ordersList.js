import { LightningElement, track } from 'lwc';
import getPreviousOrders from '@salesforce/apex/RestaurantOrderController.getPreviousOrders';

export default class OrdersList extends LightningElement {

    @track totalPrice;
    orders;
    error;

    columns = [
        {label: 'Date', fieldName: 'Order_Date__c', type: 'date'},
        {label: 'Status', fieldName: 'Status__c'},
        {label: 'Price', fieldName: 'Sum__c', type: 'currency'}
    ];

    get isEmpty() {
        return this.orders.length == 0;
    }

    connectedCallback() {
        this.loadOldOrders();
    }

    closeModal() {
        const selectedEvent = new CustomEvent('closemodal', {detail: false});
        this.dispatchEvent(selectedEvent);
    }

    //Date of orders?
    loadOldOrders() {
        getPreviousOrders()
        .then(result => {
        this.orders = result;
        this.solveTotalPrice();
        })
        .catch(error => {
        this.error = error;
        })
    }

    solveTotalPrice() {
        let sum = 0.0;
        this.orders.forEach((order) => {
        sum += +order.Sum__c;
        });
        this.totalPrice = sum.toFixed(2);
    }

} 