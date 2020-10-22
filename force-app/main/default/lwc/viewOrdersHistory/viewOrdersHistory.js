import { LightningElement, track } from 'lwc';

import ordersHistory from '@salesforce/label/c.ordersHistory';

export default class ViewOrdersHistory extends LightningElement {

    label = {
        ordersHistory
    }

    @track isOrdersModal = false;

    openModal() {
        this.isOrdersModal = true;
    }

    closeModal() {
        this.isOrdersModal = false;
    }

}