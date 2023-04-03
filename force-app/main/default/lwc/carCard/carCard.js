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

import { NavigationMixin } from 'lightning/navigation';
import CAR_SELECTED_MESSAGE from '@salesforce/messageChannel/CarSelected__c';

//Importing the getFieldValue function to extract the values of the fields
import { getFieldValue } from 'lightning/uiRecordApi';


export default class CarCard extends NavigationMixin(LightningElement) {

    recordId
    @wire(MessageContext)
    messageContext
    carSelectionSubscription

    // Exposing the fields to the template
    categoryField=CATEGORY_FIELD
    makeField=MAKE_FIELD
    msrpField=MSRP_FIELD
    fuelField=FUEL_FIELD
    seatField=SEATS_FIELD
    controlField=CONTROL_FIELD
    carName
    carPicture

    
    handleRecordLoded(event){
      const {records}=event.detail
      const recordData=records[this.recordId]
      this.carName=getFieldValue(recordData,NAME_FIELD) 
      this.carPicture=getFieldValue(recordData,PICTURE_URL_FIELD)

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
      this[NavigationMixin.Navigate]({
        type:'standard__recordPage',
        attributes:{
          recordId:this.recordId,
          objectApiName:CAR_OBJECT.objectApiName,
          actionName:'view'
        }
      })
    }

}

