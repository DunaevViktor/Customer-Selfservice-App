import { LightningElement, wire, track } from 'lwc';
import checkOrderExistence from '@salesforce/apex/RestaurantOrderController.checkOrderExistence';
import getOrder from '@salesforce/apex/RestaurantOrderController.getOrder';
import MESSAGE_CHANNEL from "@salesforce/messageChannel/OrderItemMessage__c";
import { APPLICATION_SCOPE, subscribe, unsubscribe, MessageContext } from 'lightning/messageService';

export default class OrderDetailComponent extends LightningElement {

    order;
    error;
    orderItems = [];
    isDetailsModalOpen = false;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {

        checkOrderExistence()
        .then(result => {
            this.loadOrder();
        })
        .catch(error => {
            this.error = error;
        })

        this.subscribeToMessageChannel();
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

    subscribeToMessageChannel() {
        if(!this.subscription){
            this.subscription = subscribe(
                this.messageContext,
                MESSAGE_CHANNEL,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
        else{
            this.subscription = subscribe(
                this.messageContext,
                MESSAGE_CHANNEL,
                (message) => {this.handleMessage(message);}
            );
        }
        
    }

    handleMessage(message) {
        const orderItem = message.orderItem;
        this.orderItems.push(orderItem);
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    get totalPrice() {
        let sum = 0;
        this.orderItems.forEach((orderItem) => {
          sum += orderItem.fields.Cost__c.value;
        });
        return sum;
    }

    openDetailsModal() {
        this.isDetailsModalOpen = true;
    }

    closeDetailsModal() {
        this.isDetailsModalOpen = false;
    }
    
}