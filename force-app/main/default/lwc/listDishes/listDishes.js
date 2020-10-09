import { LightningElement, track } from 'lwc';
import getMenu from '@salesforce/apex/dishCont.getMenu';

export default class ListDishes extends LightningElement {

    name = 'cola';
    dishes;
    error;
    

    connectedCallback() {
        this.loadMenu();
      }
    
      loadMenu() {
        getMenu(this.name)
        .then(result => {
          this.dishes = result;
          console.log(this.dishes);
        })
        .catch(error => {
          this.error = error;
          console.log(error);
        });
      }



}