import { api, LightningElement, wire } from 'lwc';
// Here, we are importing the necessary objects, fields, and methods from Salesforce.
import CAR_OBJECT from '@salesforce/schema/Car__c';
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c';
import getSimilarCars from '@salesforce/apex/carController.getSimilarCars';
import { getRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
export default class SimilarCars extends NavigationMixin(LightningElement) {

    // we are defining recordId and objectApiName as public properties, which can be accessed outside of the component.
    @api recordId
    @api objectApiName

    // we are initializing the objectApiName with CAR_OBJECT and declaring an empty similarCars array.
    objectApiName=CAR_OBJECT
    similarCars
    
    /* we are using the @wire decorator to call the getRecord method from the lightning/uiRecordApi
     module to fetch the car record based on the recordId and MAKE_FIELD*/
    @wire(getRecord,{recordId:'$recordId',fields:[MAKE_FIELD]})
    car


    /*we are defining a function named handleFetch which is called when the user 
     clicks on the 'Fetch Similar Cars' button. This function calls the getSimilarCars
     method from the carController Apex class and passes the recordId and Make value of 
     the current car record. The returned result is assigned to the similarCars array. */
    handleFetch(){
        getSimilarCars({
            carId:this.recordId,
            makeType:this.car.data.fields.Make__c.value
        })
        .then(result=>{
            this.similarCars=result
            //console.log(this.similarCars);
        })
        .catch(error=>{
            console.error(error);
        })

    }

    /*This method called when the user clicks on the 'View' button for a similar car record.
     This function uses the NavigationMixin to navigate to the standard record page of the clicked car record. */
    handleviewClick(event){
        this[NavigationMixin.Navigate]({
            type:'standard__recordPage',
            attributes:{
                recordId:event.target.dataset.id,
                objectApiName:this.objectApiName,
                actionName:'view'
            }

        })
    }
}