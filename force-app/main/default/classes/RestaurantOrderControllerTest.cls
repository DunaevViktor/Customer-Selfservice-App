@isTest
public with sharing class RestaurantOrderControllerTest {

    public static String OPEN_STATUS = 'Open';
    public static String CLOSE_STATUS = 'Closed';

    public static String EXPECTED_ORDER_CREATION = 'Expected creation of order.';
    public static String INVALID_AMOUNT_OF_ORDERS = 'Actual amount of orders does not equal to expected.';
    public static String INVALID_ID_OF_ORDER = 'Actual id of order does not equal to expected.';

    @IsTest
    public static void checkOrderExistence() {
        RestaurantOrderController.checkOrderExistence();
        List<Restaurant_Order__c> orders = [SELECT Name FROM Restaurant_Order__c];
        System.assertEquals(1, orders.size(), EXPECTED_ORDER_CREATION);
    }

    @IsTest
    public static void checkOrderExistenceWithExist() {
        Restaurant_Order__c order = new Restaurant_Order__c(Status__c = OPEN_STATUS);
        insert order;

        RestaurantOrderController.checkOrderExistence();
        List<Restaurant_Order__c> ordersResult = [SELECT Name FROM Restaurant_Order__c];

        System.assertEquals(1, ordersResult.size(), INVALID_AMOUNT_OF_ORDERS);
        System.assertEquals(order.Id, ordersResult[0].Id, INVALID_ID_OF_ORDER);
    }

    @IsTest
    public static void getOrderTest() {
        Restaurant_Order__c order = new Restaurant_Order__c(Status__c = OPEN_STATUS);
        insert order;

        Restaurant_Order__c orderResult = RestaurantOrderController.getOrder();
        System.assertEquals(order.Id, orderResult.Id, INVALID_ID_OF_ORDER);
    }

    @IsTest
    public static void getPreviousOrdersEmpty() {
        List<Restaurant_Order__c> ordersResult;

        try {
            ordersResult = RestaurantOrderController.getPreviousOrders();
        } catch (System.QueryException queryException) {
            System.assertEquals(queryException.getMessage(), queryException.getMessage());
        }

        System.assertEquals(0, ordersResult.size(), INVALID_AMOUNT_OF_ORDERS); 
    }

    @IsTest
    public static void getPreviousOrders() {
        List<Restaurant_Order__c> orders = new List<Restaurant_Order__c>();
        Integer length = 3;

        for(Integer i = 0; i < length; i++) {
            Restaurant_Order__c order = new Restaurant_Order__c(Status__c = CLOSE_STATUS);
            orders.add(order);
        }
        insert orders;

        List<Restaurant_Order__c> ordersResult = RestaurantOrderController.getPreviousOrders();
        System.assertEquals(length, ordersResult.size(), INVALID_AMOUNT_OF_ORDERS);
    }

}
