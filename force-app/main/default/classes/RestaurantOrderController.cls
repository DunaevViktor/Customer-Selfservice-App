public with sharing class RestaurantOrderController {

    @AuraEnabled
    public static Restaurant_Order__c getOrder() {
        Id userId = UserInfo.getUserId();
        Restaurant_Order__c order = [SELECT Name, OwnerId, Status__c FROM Restaurant_Order__c 
                                    WHERE OwnerId = :userId AND Status__c = 'Open' LIMIT 1];
        return order;
    }

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

    @AuraEnabled
    public static List<Restaurant_Order__c> getPreviousOrders(){
        Id userId = UserInfo.getUserId();
        List<Restaurant_Order__c> orders = [SELECT Name, OwnerId,	IsDelivery__c, Delivery_Address__c, 
                            Order_Date__c, Status__c, Sum__c, (SELECT Dish__r.Title__c FROM Order_Items__r)
                            FROM Restaurant_Order__c WHERE OwnerId = :userId AND Status__c = 'Closed'];
        
        return orders;
    }
   
}