public with sharing class carController {
    //wrapper class fot the filters
    public class Filters{
        @AuraEnabled
        public String searchKey {get;set;}

        @AuraEnabled
        public Decimal maxPrice {get;set;}

        @AuraEnabled
        public String[] categories {get;set;}

        @AuraEnabled
        public String[] makeType {get;set;}
    }

    // The @AuraEnabled annotation is used to expose the method to the Lightning Component and allow it to be cached by the client.
    @AuraEnabled(cacheable=true)
    public static List<Car__c> getCars(Filters filters) {
        String key, whereClass = '';
        Decimal maxPrice;
        String[] categories, makeType, criteria = new List<String>{};

         // Check if filters object is not null
        if(filters != null){

            // Assign the values from the filters object to local variables for easier access
            maxPrice = filters.maxPrice;
            categories = filters.categories;
            makeType = filters.makeType;

            // Check if the searchKey field is not empty
            if(!String.isEmpty(filters.searchKey)){
                key = '%' + filters.searchKey + '%';
                criteria.add('Name LIKE :key'); //Name like ford
            }  

            // Check if the maxPrice field is greater than or equal to 0
               if(filters.maxPrice >= 0){
                criteria.add('MSRP__c <= :maxPrice'); 
            }

            // Check if the categories field is not null
            if(filters.categories != null){
                criteria.add('Category__c IN :categories');
            }

            

             // Check if the makeType field is not null
            if(filters.makeType != null){
                criteria.add('Make__c IN :makeType');
            }

        
             // Check if there are any conditions in the criteria list
            if(criteria.size() > 0){
                whereClass = 'WHERE ' + String.join(criteria, ' AND '); 
            }


        }

        // Construct the SOQL query using the whereClass variable, and query the database
        String query = 'SELECT Id, Name, MSRP__c, Description__c, Category__c, Picture_URL__c FROM Car__c ' + whereClass + ' WITH SECURITY_ENFORCED ORDER BY Name';
        return Database.query(query);
        
    }

    // This method will return the records whose Make field matches the Make field of the current car record. 
    @AuraEnabled(cacheable=true)
    public static Car__c[] getSimilarCars(Id carId,String[] makeType){
        return [select Id,Name,MSRP__c,Description__c,Category__c,Picture_URL__c,Make__c 
        FROM Car__c 
        WHERE Make__c IN :makeType
        AND Id!= :carId];
    }

}
