import { LightningElement, api, wire, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import MESSAGE_CHANNEL from "@salesforce/messageChannel/OrderItemMessage__c";
import { publish, MessageContext } from 'lightning/messageService';

import ORDER_ITEM_OBJECT from '@salesforce/schema/Order_Item__c';
import DISH_FIELD from '@salesforce/schema/Order_Item__c.Dish__c';
import AMOUNT_FIELD from '@salesforce/schema/Order_Item__c.Amount__c';
import COMMENT_FIELD from '@salesforce/schema/Order_Item__c.Comment__c';
import ORDER_FIELD from '@salesforce/schema/Order_Item__c.Restaurant_Order__c';

import addToOrder from '@salesforce/label/c.addToOrder';
import dishTitle from '@salesforce/label/c.dishTitle';
import description from '@salesforce/label/c.description';
import price from '@salesforce/label/c.price';
import amountOfDishes from '@salesforce/label/c.amountOfDishes';
import comment from '@salesforce/label/c.comment';
import cancel from '@salesforce/label/c.cancel';
import ok from '@salesforce/label/c.ok';
import close from '@salesforce/label/c.close';
import errorAddOrderItem from '@salesforce/label/c.errorAddOrderItem';
import sucessfullyAddToOrder from '@salesforce/label/c.sucessfullyAddToOrder';
import error from '@salesforce/label/c.error';
import success from '@salesforce/label/c.success';

import LOCALE from '@salesforce/i18n/locale';
import CURRENCY from '@salesforce/i18n/currency';

export default class AddOredItem extends LightningElement {

    label = {
        addToOrder,
        dishTitle, 
        description,
        price,
        amountOfDishes,
        comment,
        cancel,
        ok,
        close,
        errorAddOrderItem
    }
    
    SUCCESS_TITLE = success;
    SUCCESS_MESSAGE = sucessfullyAddToOrder;
    SUCCESS_VARIANT = 'success';

    ERROR_TITLE = error;
    ERROR_MESSAGE = errorAddOrderItem;
    ERROR_VARIANT = 'error';

    objectApiName = ORDER_ITEM_OBJECT;
    fields = [DISH_FIELD, AMOUNT_FIELD, COMMENT_FIELD];

    @wire(MessageContext)
    messageContext;

    @api dish;
    @api orderid;

    @track formattedPrice;

    connectedCallback() {
        this.formattedPrice = new Intl.NumberFormat(LOCALE, {
            style: 'currency',
            currency: CURRENCY,
            currencyDisplay: 'symbol'
        }).format(this.dish.Price__c);
    }
    
    submitDetails(){

        const inputs = Array.from(this.template.querySelectorAll('lightning-input'));
        const [amount, comment] = inputs;

        //amount of dishes [0,30]
        if(!amount.value || +amount.value <= 0 || +amount.value > 30 || !!amount.value.split(".")[1]) {
            return;
        }

        const recordInput = {
            apiName: ORDER_ITEM_OBJECT.objectApiName,
            fields: {
                [DISH_FIELD.fieldApiName]: this.dish.Id,
                [AMOUNT_FIELD.fieldApiName]: +amount.value,
                [COMMENT_FIELD.fieldApiName]: comment.value,
                [ORDER_FIELD.fieldApiName] : this.orderid
            }
        };

        createRecord(recordInput)
        .then(result => {
            this.showToast(this.SUCCESS_TITLE, this.SUCCESS_MESSAGE, this.SUCCESS_VARIANT);
            this.publishMessage(result);
            this.closeModal();
        })
        .catch(error => {
            this.showToast(this.ERROR_TITLE, this.ERROR_MESSAGE, this.ERROR_VARIANT);
        })
    }

    publishMessage(orderItem) {
        const message = {
            orderItemId: orderItem.id,
            orderItemPrice: orderItem.fields.Cost__c.value
        };
        publish(this.messageContext, MESSAGE_CHANNEL, message);
    }

    showToast(title, message, variant){
        const notification = new ShowToastEvent({title, message, variant});
        this.dispatchEvent(notification);
    }

    closeModal(){
        const selectedEvent = new CustomEvent('closemodal', {detail: false});
        this.dispatchEvent(selectedEvent);
    }
    
}