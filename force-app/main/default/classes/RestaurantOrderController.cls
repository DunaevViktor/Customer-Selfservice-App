//Class for working with Restaurant_Order__c
public with sharing class RestaurantOrderController {

    //Finds and returns an open order for the current user
    @AuraEnabled
    public static Restaurant_Order__c getOrder() {
        Id userId = UserInfo.getUserId();
        Restaurant_Order__c order = [SELECT Name, OwnerId, Status__c FROM Restaurant_Order__c 
                                    WHERE OwnerId = :userId AND Status__c = 'Open' LIMIT 1];
        return order;
    }

    //Сhecks whether an open order exists for the current user
    //If it doesn't exist, it creates it
    @AuraEnabled
    public static void checkOrderExistence(){
        Id userId = UserInfo.getUserId();
        Restaurant_Order__c order;

        try {
            order = [SELECT Name, OwnerId, Status__c FROM Restaurant_Order__c 
                    WHERE OwnerId = :userId AND Status__c = 'Open' LIMIT 1];
        } catch (System.QueryException queryException) {
            order = new Restaurant_Order__c();
            insert order;
        }
    }

    //Finds and returns closed orders for the current user
    @AuraEnabled
    public static List<Restaurant_Order__c> getPreviousOrders(){
        Id userId = UserInfo.getUserId();
        List<Restaurant_Order__c> orders = [SELECT Name, OwnerId, IsDelivery__c, Delivery_Address__c, 
                            Order_Date__c, Status__c, convertCurrency(Sum__c) Sum__c, 
                            (SELECT Dish__r.Title__c FROM Order_Items__r)
                            FROM Restaurant_Order__c WHERE OwnerId = :userId 
                            AND Status__c = 'Closed' ORDER BY Order_Date__c];
        
        return orders;
    }
   
}