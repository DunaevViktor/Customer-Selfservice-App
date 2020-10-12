import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { updateRecord } from 'lightning/uiRecordApi';
import ID_FIELD from '@salesforce/schema/Restaurant_Order__c.Id';
import STATUS_FIELD from '@salesforce/schema/Restaurant_Order__c.Status__c';
import SUM_FIELD from '@salesforce/schema/Restaurant_Order__c.Sum__c';
import DELIVERY_FIELD from '@salesforce/schema/Restaurant_Order__c.IsDelivery__c';
import DELIVERY_ADDRESS_FIELD from '@salesforce/schema/Restaurant_Order__c.Delivery_Address__c';
import CLOSE_DATE_FIELD from '@salesforce/schema/Restaurant_Order__c.Order_Date__c';

export default class MakeOrder extends LightningElement {

    SUCCESS_TITLE = 'Success';
    SUCCESS_MESSAGE = 'Successfully submitted order!';
    SUCCESS_VARIANT = 'success';

    ERROR_TITLE = 'Error';
    ERROR_MESSAGE = 'Error during submitting order!';
    ERROR_VARIANT = 'error';
    ERROR_MESSAGE_EMPTY_ORDER = 'You cant create empty order!';

    DELIVERY_CHOISE = 'delivery';

    @api totalPrice;
    @api order;

    @track isDelivery = false;
    @track deliveryValue = '';

    value = '';
    error;

    get options() {
        return [
            { label: 'Pickup', value: 'pickup' },
            { label: 'Home delivery', value: 'delivery' },
        ];
    }

    closeModal() {
        const selectedEvent = new CustomEvent('closemodal', {detail: false});
        this.dispatchEvent(selectedEvent);
    }

    handleReceive(event) {
        this.deliveryValue = event.detail.value;
        this.isDelivery = this.deliveryValue == this.DELIVERY_CHOISE;
    }

    makeOrder() {

        if(this.totalPrice <= 0){
            console
            this.showToast(this.ERROR_TITLE, this.ERROR_MESSAGE_EMPTY_ORDER, this.ERROR_VARIANT);
            //this.closeModal();
            return;
        }

        if(this.deliveryValue == ''){
            return;
        }

        let date = new Date();
        const fields = {};

        fields[ID_FIELD.fieldApiName] = this.order.Id;
        fields[STATUS_FIELD.fieldApiName] = 'Closed';
        fields[SUM_FIELD.fieldApiName] = this.totalPrice;
        fields[DELIVERY_FIELD.fieldApiName] = this.isDelivery;
        fields[CLOSE_DATE_FIELD.fieldApiName] = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

        if(this.isDelivery) {
            const input = this.template.querySelector('lightning-input')
            const value = input.value;
            fields[DELIVERY_ADDRESS_FIELD.fieldApiName] = value;
            input.value = ''
        }

        const recordInput = { fields };

        updateRecord(recordInput)
        .then(() => {
            const selectedEvent = new CustomEvent('submit', {detail: false});
            this.dispatchEvent(selectedEvent);
            this.showToast(this.SUCCESS_TITLE, this.SUCCESS_MESSAGE, this.SUCCESS_VARIANT);
        })
        .catch(error => {
            this.showToast(this.ERROR_TITLE, this.ERROR_MESSAGE, this.ERROR_VARIANT);
        })
    }

    showToast(title, message, variant) {
        const notification = new ShowToastEvent({title, message, variant});
        this.dispatchEvent(notification);
    }

}