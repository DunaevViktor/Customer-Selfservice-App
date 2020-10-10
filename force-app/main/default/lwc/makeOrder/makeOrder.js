import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { updateRecord } from 'lightning/uiRecordApi';
import ID_FIELD from '@salesforce/schema/Restaurant_Order__c.Id';
import STATUS_FIELD from '@salesforce/schema/Restaurant_Order__c.Status__c';
import SUM_FIELD from '@salesforce/schema/Restaurant_Order__c.Sum__c';

export default class MakeOrder extends LightningElement {

    SUCCESS_TITLE = 'Success';
    SUCCESS_MESSAGE = 'Successfully submitted order!';
    SUCCESS_VARIANT = 'success';

    ERROR_TITLE = 'Error';
    ERROR_MESSAGE = 'Error during submitting order!';
    ERROR_VARIANT = 'error';

    DELIVERY_CHOISE = 'delivery';

    @api totalPrice;
    @api order;

    @track isDelivery = false;

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
        const selectedOption = event.detail.value;
        this.isDelivery = selectedOption == this.DELIVERY_CHOISE;
    }

    makeOrder() {
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.order.Id;
        fields[STATUS_FIELD.fieldApiName] = 'Closed';
        fields[SUM_FIELD.fieldApiName] = this.totalPrice;

        const recordInput = { fields };

        updateRecord(recordInput)
        .then(() => {
            const selectedEvent = new CustomEvent('submit', {detail: false});
            this.dispatchEvent(selectedEvent);
            this.showToast(this.SUCCESS_TITLE, this.SUCCESS_MESSAGE, this.SUCCESS_VARIANT);
        })
        .catch(error => {
            this.showToast(this.ERROR_TITLE. ERROR_MESSAGE, this.ERROR_VARIANT);
        })
    }

    showToast(title, message, variant) {
        const notification = new ShowToastEvent({title, message, variant});
        this.dispatchEvent(notification);
    }

} 