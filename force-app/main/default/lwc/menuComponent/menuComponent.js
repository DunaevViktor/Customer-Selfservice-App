import { LightningElement, track } from 'lwc';
import getListOfDishes from '@salesforce/apex/DishController.getListOfDishes';

export default class MenuComponent extends LightningElement {

    dishes;
    error;
    isModalOpen = false;
    @track dishId;

    connectedCallback(){
        this.loadMenu();
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
    
}