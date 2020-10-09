import { LightningElement, wire, track } from 'lwc';
import checkOrderExistence from '@salesforce/apex/RestaurantOrderController.checkOrderExistence';
import getOrder from '@salesforce/apex/RestaurantOrderController.getOrder';
import getOrderItemsByOrderId from '@salesforce/apex/OrderItemController.getOrderItemsByOrderId';
import getOrderItemById from '@salesforce/apex/OrderItemController.getOrderItemById';

import MESSAGE_CHANNEL from "@salesforce/messageChannel/OrderItemMessage__c";
import ORDER_MC from "@salesforce/messageChannel/OrderMessage__c";
import { APPLICATION_SCOPE, subscribe, unsubscribe, MessageContext, publish } from 'lightning/messageService';

export default class OrderDetailComponent extends LightningElement {

    order;
    error;
    orderItems = [];
    isDetailsModalOpen = false;

    @track totalPrice = 0.0;

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
        this.loadOrderItems();
        setInterval(() => {
            this.publishMessage();
        }, 5000);
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
    }

    handleMessage(message) {
        this.totalPrice += message.orderItemPrice;
        this.loadNewOrderItem(message.orderItemId);
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    //+ , toFixed(2)
    resolveTotalPrice() {
        let sum = 0;
        this.orderItems.forEach((orderItem) => {
          sum += orderItem.Cost__c;
        });
        this.totalPrice = sum;
    }

    openDetailsModal() {
        this.isDetailsModalOpen = true;
    }

    closeDetailsModal() {
        this.isDetailsModalOpen = false;
    }

    loadOrderItems() {
        getOrderItemsByOrderId({id: this.order.Id})
        .then(result => {
            this.orderItems = result;
            this.resolveTotalPrice();
        })
        .catch(error => {
            this.error = error;
        })
    }

    loadNewOrderItem(id) {
        getOrderItemById({id: id})
        .then(result => {
            this.orderItems.push(result);
        })
        .catch(error => {
            this.error = error;
        })
    }

    publishMessage() {
        const message = {
            orderId: this.order.Id
        };
        publish(this.messageContext, ORDER_MC, message);
    }
    
}