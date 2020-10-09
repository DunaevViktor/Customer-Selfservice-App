import { LightningElement, api } from 'lwc';

export default class MenuItem extends LightningElement {

    @api dish;

    handleClick(){
        const selectedEvent = new CustomEvent('choosed', {detail: this.dish.Id});
        this.dispatchEvent(selectedEvent);
    }
    
}