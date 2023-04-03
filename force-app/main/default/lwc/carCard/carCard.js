import { LightningElement, wire } from 'lwc';

//Importing all the required fields for the Car object
import CAR_OBJECT from '@salesforce/schema/Car__c';
import NAME_FIELD from '@salesforce/schema/Car__c.Name';
import PICTURE_URL_FIELD from '@salesforce/schema/Car__c.Picture_URL__c';
import CATEGORY_FIELD from '@salesforce/schema/Car__c.Category__c';
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c';
import MSRP_FIELD from '@salesforce/schema/Car__c.MSRP__c';
import FUEL_FIELD from '@salesforce/schema/Car__c.Fuel_Type__c';
import SEATS_FIELD from '@salesforce/schema/Car__c.Number_of_Seats__c';
import CONTROL_FIELD from '@salesforce/schema/Car__c.Control__c';

//Importing the required modules for LMS
import { APPLICATION_SCOPE,createMessageContext, MessageContext, publish, releaseMessageContext, subscribe, unsubscribe} from 'lightning/messageService';

//Importing the required NavigationMixin for navigation between records
import { NavigationMixin } from 'lightning/navigation';

//Importing the CarSelected__c message channel to be used for LMS
import CAR_SELECTED_MESSAGE from '@salesforce/messageChannel/CarSelected__c';

//Importing the getFieldValue function to extract the values of the fields
import { getFieldValue } from 'lightning/uiRecordApi';


export default class CarCard extends NavigationMixin(LightningElement) {

    // Initializing the hardcoded value for recordId as null
    recordId

    

    //load context for lms
    @wire(MessageContext)
    messageContext

    //subscribtion references
    carSelectionSubscription

    // Exposing the fields to the template
    categoryField=CATEGORY_FIELD
    makeField=MAKE_FIELD
    msrpField=MSRP_FIELD
    fuelField=FUEL_FIELD
    seatField=SEATS_FIELD
    controlField=CONTROL_FIELD

    // Car fields displayed with specific format
    carName
    carPicture

    //whenever the record view is loaded
    handleRecordLoded(event){

    /*This line of code assigns the value of the records property of the "event.detail" object to a new variable named records. 
      The "event.detail" object is commonly used in custom events in JavaScript to pass data to event listeners.*/
          
      const {records}=event.detail

    /*This line of code creates a new variable named recordData and sets its value to the record object from the records array
      that has an Id property equal to this.recordId. The value of this.recordId is not shown in this code snippet, but it is likely
      defined somewhere else in the code. */

      const recordData=records[this.recordId]
      this.carName=getFieldValue(recordData,NAME_FIELD) //This is for Car Name
      this.carPicture=getFieldValue(recordData,PICTURE_URL_FIELD) //This is for Car Image

    }

    // This function is called whenever the component is connected to the DOM
    connectedCallback(){
      this.subscribeHandler()
    }

     // This function is used to subscribe to the CarSelected__c message channel
    subscribeHandler(){
     this.carSelectionSubscription= subscribe(this.messageContext,CAR_SELECTED_MESSAGE,(message)=>this.handlecarSelected(message))
    }

     // This function is called whenever a CarSelected__c message is received
    handlecarSelected(message){
      this.recordId=message.carId
    }


    // This function is called whenever the component is removed from the DOM
    disconnectedCallback(){
      unsubscribe(this.carSelectionSubscription)
      this.carSelectionSubscription=null
    }

    // This function is used for navigation to the record page
    handleNavigateRecord(){

      //The method uses the NavigationMixin to navigate to a specific record page.
      this[NavigationMixin.Navigate]({

        //When the method is called, a navigation object is created with the type property set to 'standard__recordPage'.
        type:'standard__recordPage',

        //The attributes property of the navigation object is an object with three properties: recordId, objectApiName, and actionName.
        attributes:{

          //The recordId property is set to the recordId property of the CarCard component.
          recordId:this.recordId,

          //The objectApiName property is set to the objectApiName property of the CAR_OBJECT import.
          objectApiName:CAR_OBJECT.objectApiName,

          //The actionName property is set to 'view'.
          actionName:'view'
        }
      })
    }

}

