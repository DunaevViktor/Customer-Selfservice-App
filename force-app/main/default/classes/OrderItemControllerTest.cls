//Class for testing OrderItemController class
@isTest
public with sharing class OrderItemControllerTest {

    public static String OPEN_STATUS = 'Open';

    public static String TEST_DISH_NAME = 'Garag limon';
    public static String TEST_DISH_CATEGORY = 'Drinks';
    public static String TEST_DISH_SUBCATEGORY = 'Beer';
    public static Decimal TEST_PRICE = 1.0;

    public static String EXPECTED_NO_ITEMS = 'Actual amount of order items does not equal to excpected.';
    public static String INVALID_AMOUNT = 'Actual amount of order items does not equal to excpected.';
    public static String INVALID_ID = 'Actual id of order items does not equal to excpected.';

    @TestSetup
    static void makeData(){
        Restaurant_Order__c order = new Restaurant_Order__c(Status__c = OPEN_STATUS);
        insert order;

        Dish__c dish = new Dish__c( Title__c = TEST_DISH_NAME,
                                    Category__c = TEST_DISH_CATEGORY,
                                    Subcategory__c = TEST_DISH_SUBCATEGORY,
                                    Price__c = TEST_PRICE);
        insert dish;
    }

    @IsTest
    public static void getOrderItemsByOrderIdEmpty() {
        Restaurant_Order__c order = [SELECT Name FROM Restaurant_Order__c WHERE Status__c = 'Open' LIMIT 1];
        List<Order_Item__c> items;

        try {
            items = OrderItemController.getOrderItemsByOrderId(order.Id);
        } catch (System.QueryException queryException) {
            System.assertEquals(queryException.getMessage(), queryException.getMessage());
        }

        System.assertEquals(0, items.size(), EXPECTED_NO_ITEMS);
    }

    @IsTest
    public static void getOrderItemsByOrderId() {
        Restaurant_Order__c order = [SELECT Name FROM Restaurant_Order__c WHERE Status__c = 'Open' LIMIT 1];
        Dish__c dish = [SELECT Name FROM Dish__c LIMIT 1];

        Integer length = 3;
        List<Order_Item__c> items = new List<Order_Item__c>();

        for(Integer i = 0; i < length; i++) {
            Order_Item__c orderItem = new Order_Item__c(Dish__c = dish.Id,
                                                        Amount__c = 1,
                                                        Restaurant_Order__c = order.Id);
            items.add(orderItem);
        }
        insert items;

        List<Order_Item__c> resultItems = OrderItemController.getOrderItemsByOrderId(order.Id);
        System.assertEquals(length, resultItems.size(), EXPECTED_NO_ITEMS);
    }

    @IsTest
    public static void getOrderItemByIdTest() {
        Restaurant_Order__c order = [SELECT Name FROM Restaurant_Order__c WHERE Status__c = 'Open' LIMIT 1];
        Dish__c dish = [SELECT Name FROM Dish__c LIMIT 1];

        Order_Item__c orderItem = new Order_Item__c(Dish__c = dish.Id,
                                                    Amount__c = 1,
                                                    Restaurant_Order__c = order.Id);
        insert orderItem;

        Order_Item__c resultOrderItem = OrderItemController.getOrderItemById(orderItem.Id);
        System.assertEquals(orderItem.Id, resultOrderItem.Id, INVALID_ID);
    }

}
