//Class for working with Order_Item__c
public with sharing class OrderItemController {

    //Finds and returns order items by related order's id
    @AuraEnabled
    public static List<Order_Item__c> getOrderItemsByOrderId(String id) {
        List<Order_Item__c> items = [SELECT Dish__r.Title__c, Restaurant_Order__c, Amount__c,
                                    Comment__c, convertCurrency(Cost__c) Cost__c 
                                    FROM Order_Item__c WHERE Restaurant_Order__c = :id];
        return items;
    }

    //Finds and returns order item by it id
    @AuraEnabled(cacheable=true)
    public static Order_Item__c getOrderItemById(String id) {
        return [SELECT Id, Dish__r.Title__c, Restaurant_Order__c, Amount__c, 
                Comment__c, convertCurrency(Cost__c) Cost__c
                FROM Order_Item__c WHERE Id = :id];
    }

}