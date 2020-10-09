import { LightningElement } from 'lwc';
import checkOrderExistence from '@salesforce/apex/RestaurantOrderController.checkOrderExistence';
import getOrder from '@salesforce/apex/RestaurantOrderController.getOrder';

export default class OrderDetailComponent extends LightningElement {

    order;
    error;
    orderItems;

    connectedCallback() {
        checkOrderExistence()
        .then(result => {
            this.loadOrder();
        })
        .catch(error => {
            this.error = error;
        })
    }

    loadOrder() {
        getOrder()
        .then(result => {
        this.order = result;
        })
        .catch(error => {
        this.error = error;
        })
    }
    
}