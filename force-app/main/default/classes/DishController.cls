public with sharing class DishController {

    @AuraEnabled(cacheable=true)
    public static List<Dish__c> getListOfDishes() {
        List<Dish__c> listDishes = [
            SELECT 	Name, Price__c, Description__c 
            FROM Dish__c
       ];
       return listDishes;
    }

}