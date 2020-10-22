import { LightningElement, track, wire } from 'lwc';
import getListOfDishes from '@salesforce/apex/DishController.getListOfDishes';
import ORDER_MC from "@salesforce/messageChannel/OrderMessage__c";
import { APPLICATION_SCOPE, subscribe, unsubscribe, MessageContext } from 'lightning/messageService';

import menu from '@salesforce/label/c.menu';
import noElements from '@salesforce/label/c.noElements';
import errorLoadingMenu from '@salesforce/label/c.errorLoadingMenu';
import firstPage from '@salesforce/label/c.firstPage';
import previousPage from '@salesforce/label/c.previousPage';
import nextPage from '@salesforce/label/c.nextPage';
import lastPage from '@salesforce/label/c.lastPage';

export default class MenuComponent extends LightningElement {

    label = {
        menu,
        noElements,
        errorLoadingMenu,
        firstPage,
        previousPage,
        nextPage,
        lastPage
    };

    FILTER_ALL = '--All--';

    @wire(MessageContext)
    messageContext;

    dishes;
    error;
    isModalOpen = false;
    filterCategory = this.FILTER_ALL;
    filterSubcategory = this.FILTER_ALL;

    @track dish;
    @track orderId;
    @track displayesDishes = [];
    @track currentPage = 1;
    @track amountPages = 0;
    @track itemsOnPage = 6;
    @track isFirstDisabled = true;
    @track isPreviousDisabled = true;
    @track isNextDisabled = true;
    @track isLastDisabled = true;
    @track loading = false;

    connectedCallback(){
        this.loading = true;
        this.loadMenu();
        this.subscribeToMessageChannel();
    }

    loadMenu(){
        getListOfDishes()
        .then(result => {
            this.dishes = result;
            this.resolveDisplayedDishes();
            this.loading = false;
        })
        .catch(error => {
            this.error = error;
            this.loading = false;
        });
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

    filterDishes() {
        if(this.filterCategory == this.FILTER_ALL) {
          return this.dishes;
        }
    
        const filteredDishes = this.dishes.filter((item) => {
          return item.Category__c == this.filterCategory;
        });
    
        if(this.filterSubcategory == this.FILTER_ALL) {
          return filteredDishes;
        }
    
        return filteredDishes.filter((item) => {
          return item.Subcategory__c == this.filterSubcategory;
        });
    }

    repaintPaginationButtons() {
        if(this.currentPage == 1) {
            this.isFirstDisabled = true;
            this.isPreviousDisabled = true;
        } else {
            this.isFirstDisabled = false;
            this.isPreviousDisabled = false;
        }
    
        if(this.currentPage >= this.amountPages) {
            this.isNextDisabled = true;
            this.isLastDisabled = true;
        } else {
            this.isNextDisabled = false;
            this.isLastDisabled = false;
        }
    }

    resolveDisplayedDishes() {
        const filteredDishes = this.filterDishes();
        this.amountPages = Math.ceil(filteredDishes.length / this.itemsOnPage);
        this.displayesDishes = filteredDishes.filter((item, index) => {
            return index >= (this.currentPage-1) * this.itemsOnPage && index < (this.currentPage) * this.itemsOnPage;
        });
        this.repaintPaginationButtons();
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

    clickFirstPage() {
        this.currentPage = 1;
        this.resolveDisplayedDishes();
    }

    clickNextPage() {
        if(this.currentPage >= this.amountPages) return;
    
        this.currentPage++;
        this.resolveDisplayedDishes();
    }

    clickPreviousPage() {
        if(this.currentPage == 1) return;
    
        this.currentPage--;
        this.resolveDisplayedDishes();
    }

    clickLastPage() {
        this.currentPage = this.amountPages;
        this.resolveDisplayedDishes();
    }

    get dishesLength() {
        return this.displayesDishes == 0;
    }

    amountChange(event) {
        this.itemsOnPage = event.detail;
        this.resolveDisplayedDishes();
    }

    categoryChange(event) {
        this.filterCategory = event.detail;
    }

    subcategoryChange(event) {
        this.filterSubcategory = event.detail;
        this.currentPage = 1;
        this.resolveDisplayedDishes();
    }

    handleChoose(event){
        this.dish = event.detail;
        this.isModalOpen = true;
    }

    closeModal(){
        this.isModalOpen = false;
    }
    
}