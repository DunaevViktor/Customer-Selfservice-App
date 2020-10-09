public with sharing class RestaurantOrderController {

    @AuraEnabled(cacheable=true)
    public static Restaurant_Order__c getOrder() {
        Id userId = UserInfo.getUserId();
        Restaurant_Order__c order = [SELECT Name FROM Restaurant_Order__c WHERE OwnerId = :userId LIMIT 1];
        return order;
    }

    @AuraEnabled
    public static void checkOrderExistence(){
        Id userId = UserInfo.getUserId();
        Restaurant_Order__c order;

        try {
            order = [SELECT Name FROM Restaurant_Order__c WHERE OwnerId = :userId LIMIT 1];
        } catch (System.QueryException queryException) {
            order = new Restaurant_Order__c();
            insert order;
        }
    }
    
}