import { LightningElement, track } from 'lwc';

export default class ViewOrdersHistory extends LightningElement {

    @track isOrdersModal = false;

    openModal() {
        this.isOrdersModal = true;
    }

    closeModal() {
        this.isOrdersModal = false;
    }

}