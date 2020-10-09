import { LightningElement, track, wire } from 'lwc';
import getListOfDishes from '@salesforce/apex/DishController.getListOfDishes';
import ORDER_MC from "@salesforce/messageChannel/OrderMessage__c";
import { APPLICATION_SCOPE, subscribe, unsubscribe, MessageContext } from 'lightning/messageService';

export default class MenuComponent extends LightningElement {

    @wire(MessageContext)
    messageContext;

    dishes;
    error;
    isModalOpen = false;
    @track dishId;
    @track orderId;

    connectedCallback(){
        this.loadMenu();
        this.subscribeToMessageChannel();
    }

    loadMenu(){
        getListOfDishes()
        .then(result => {
            this.dishes = result;
        })
        .catch(error => {
            this.error = error;
        })
    }

    handleChoose(event){
        this.dishId = event.detail;
        this.isModalOpen = true;
    }

    closeModal(){
        this.isModalOpen = false;
    }

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                ORDER_MC,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    handleMessage(message) {
        this.orderId = message.orderId;
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }
    
}