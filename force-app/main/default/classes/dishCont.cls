public with sharing class dishCont {
    @AuraEnabled(cacheable=true)
    public static List<Dish__c> getMenu(String myname) {
        return [
            SELECT Id, Name FROM Dish__c WHERE Name =:myname
       ];
    }
}