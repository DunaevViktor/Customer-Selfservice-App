import { LightningElement, track, wire } from 'lwc';
import getPreviousOrders from '@salesforce/apex/RestaurantOrderController.getPreviousOrders';

export default class OrdersList extends LightningElement {

    FILTER_ALL = '--All--';

    @track totalPrice;
    @track filteredOrders= [];

    orders;
    error;
    filterStatus = this.FILTER_ALL;
    filterDate = this.FILTER_ALL;
    filterDish = this.FILTER_ALL;

    //{label: 'Owner', fieldName: 'OwnerId'}
    columns = [
        {label: 'Name', fieldName: 'Name'},
        {label: 'Date', fieldName: 'Order_Date__c'},
        {label: 'Status', fieldName: 'Status__c'},
        {label: 'Price', fieldName: 'Sum__c', type: 'currency'}
    ];

    get isEmpty() {
        return this.orders.length == 0;
    }

    get isEmptyFilter() {
        return this.filteredOrders.length == 0;
    }

    connectedCallback() {
        this.loadOldOrders();
    }

    closeModal() {
        const selectedEvent = new CustomEvent('closemodal', {detail: false});
        this.dispatchEvent(selectedEvent);
    }

    loadOldOrders() {
        getPreviousOrders()
        .then(result => {
        this.orders = result;
        this.filterOrders();
        this.solveTotalPrice();
        })
        .catch(error => {
        this.error = error;
        })
    }

    solveTotalPrice() {
        let sum = 0.0;
        this.orders.forEach((order) => {
        sum += +order.Sum__c;
        });
        this.totalPrice = sum.toFixed(2);
    }

    filterOrders() {
        this.filteredOrders = this.orders;
    
        if(this.filterStatus != this.FILTER_ALL) {
            this.filteredOrders = this.filteredOrders.filter((order) => {
                return order.Status__c == this.filterStatus;
            })
        }
    
        if(this.filterDate != this.FILTER_ALL) {
            this.filteredOrders = this.filteredOrders.filter((order) => {
                return order.Order_Date__c == this.filterDate;
            })
        }
    
        if(this.filterDish != this.FILTER_ALL) {
            this.filteredOrders = this.filteredOrders.filter((order) => {
                let orderItems = order.Order_Items__r;
                orderItems = orderItems.filter((orderItem) => {
                    return orderItem.Dish__r.Title__c == this.filterDish;
                });
            return orderItems.length > 0;
          });
        }
    }

    filterStatusChange(event) {
        this.filterStatus = event.detail;
        this.filterOrders();
    }

    filterDateChange(event) {
        this.filterDate = event.detail;
        this.filterOrders();
    }

    filterDishChange(event) {
        this.filterDish = event.detail;
        this.filterOrders();
    }

} 