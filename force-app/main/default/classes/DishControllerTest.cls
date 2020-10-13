//Class for testing DishController class
@isTest
public with sharing class DishControllerTest {

    public static String TEST_DISH_NAME = 'Garag limon';
    public static String TEST_DISH_CATEGORY = 'Drinks';
    public static String TEST_DISH_SUBCATEGORY = 'Beer';

    public static String EXPECTED_NO_DISHES = 'Actual amount of dishes does not equal to excpected.';
    public static String INVALID_AMOUNT = 'Actual amount of dishes does not equal to excpected.';

    @isTest
    public static void testEmptyDishes() {
        List<Dish__c> dishes = DishController.getListOfDishes();
        System.assertEquals(0, dishes.size(), EXPECTED_NO_DISHES);
    }

    @isTest
    public static void testWithDishData() {
        List<Dish__c> dishes = new List<Dish__c>();
        Integer length = 3;

        for(Integer i = 0; i < length; i++) {
            Dish__c dish = new Dish__c(Title__c = TEST_DISH_NAME,
                                       Category__c = TEST_DISH_CATEGORY,
                                       Subcategory__c = TEST_DISH_SUBCATEGORY,
                                       Price__c = i);
            dishes.add(dish);
        }
        insert dishes;

        List<Dish__c> resultDishes = DishController.getListOfDishes();
        System.assertEquals(length, resultDishes.size(), INVALID_AMOUNT); 
    }

}
