import { LightningElement, api, wire } from 'lwc';
import { getRecord, createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import MESSAGE_CHANNEL from "@salesforce/messageChannel/OrderItemMessage__c";
import { publish, MessageContext } from 'lightning/messageService';

import TITLE_FIELD from '@salesforce/schema/Dish__c.Title__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Dish__c.Description__c';
import PRICE_FIELD from '@salesforce/schema/Dish__c.Price__c';

import ORDER_ITEM_OBJECT from '@salesforce/schema/Order_Item__c';
import DISH_FIELD from '@salesforce/schema/Order_Item__c.Dish__c';
import AMOUNT_FIELD from '@salesforce/schema/Order_Item__c.Amount__c';
import COMMENT_FIELD from '@salesforce/schema/Order_Item__c.Comment__c';
import ORDER_FIELD from '@salesforce/schema/Order_Item__c.Restaurant_Order__c';

export default class AddOredItem extends LightningElement {
    SUCCESS_TITLE = 'Success';
    SUCCESS_MESSAGE = 'Successfully added to the order!';
    SUCCESS_VARIANT = 'success';

    ERROR_TITLE = 'Error';
    ERROR_MESSAGE = 'Error during adding new order item!';
    ERROR_VARIANT = 'error';

    objectApiName = ORDER_ITEM_OBJECT;
    fields = [DISH_FIELD, AMOUNT_FIELD, COMMENT_FIELD];

    @wire(MessageContext)
    messageContext;

    @api dishid;
    @api orderid;
    dish;

    @wire(getRecord, {recordId: '$dishid', fields: [TITLE_FIELD, DESCRIPTION_FIELD, PRICE_FIELD]})
    wiredAccount({data, error}){
        if(data){
            this.dish = data;
            this.error = undefined;
        }
        else if(error){
            this.error = error;
            this.dish = undefined;
        }
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
                [DISH_FIELD.fieldApiName]: this.dishid,
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