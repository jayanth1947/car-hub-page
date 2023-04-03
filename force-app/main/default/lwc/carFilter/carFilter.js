import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import { LightningElement, wire } from 'lwc';
import CAR_OBJECT from '@salesforce/schema/Car__c';
import MAKE_FIELD from  '@salesforce/schema/Car__c.Make__c';
import CATEGORY_FIELD from '@salesforce/schema/Car__c.Category__c';
//Lightning Message Service and a message channel
import { APPLICATION_SCOPE,createMessageContext, MessageContext, publish, releaseMessageContext, subscribe, unsubscribe} from 'lightning/messageService';
import CARS_FILTERED_MESSAGE from '@salesforce/messageChannel/CarsFiltered__c';


//Constants for Error messsages
const CATEGORY_ERROR ='Error Loading Categories'
const MAKE_ERROR ='Error Loading Make'

export default class CarFilter extends LightningElement {

    //For any Error Messages to above constant variables
   categoryError=CATEGORY_ERROR
   makeError=MAKE_ERROR
   //timer is used for delaying the result that is stored on the screen
   timer

   //This is for searchCmp and Max price slider
   filters={
    searchKey:'',
    maxPrice:999999
}

    //Load Context for LMS
    @wire(MessageContext)
    messageContext

    // Fetching Category PickList

    @wire(getObjectInfo,{objectApiName:CAR_OBJECT})
    carObjectInfo


    /* 
    recordTypeId is a variable or attribute that holds the ID of the record type associated with a particular record in Salesforce. 
    - This is often used when creating or updating records in Apex code or Lightning Components.

       $carObjectInfo is a variable or attribute that holds data about the object "carObjectInfo". 
       - The $ symbol is used to reference a component or object in the Lightning Component Framework.

       .data is a property of the "carObjectInfo" object that holds the data associated with the object. 
       This may include metadata about the object, such as its default record type ID.

       .defaultRecordTypeId is a property of the data object that holds the default record type ID for the "carObjectInfo" object. 
        This is the ID that will be used when creating new records for the object, unless a different record type is specified. 
        */
    @wire(getPicklistValues,{
        recordTypeId:'$carObjectInfo.data.defaultRecordTypeId',
        fieldApiName:CATEGORY_FIELD
    })categories


    // Fetching Making PickList
    @wire(getPicklistValues,{
        recordTypeId:'$carObjectInfo.data.defaultRecordTypeId',
        fieldApiName:MAKE_FIELD
    })makeType


    /*In both of these methods, we are using the spread operator (...) to create a copy of the filters object, 
    and then updating the specific property with the new value. The sendDataToCarList() method is then called to
     publish the updated filter to the CARS_FILTERED_MESSAGE channel. 
     
     this.filters={...this.filters,"searchKey" :event.target.value}
     - This line of code is used to update the "filters" object with a new "searchKey" property. 
     - The syntax used here is the spread operator {...this.filters} to create a copy of the "filters" object,
      and then add a new "searchKey" property to it. The value of the "searchKey" property is assigned from the "value" attribute 
      of the input element that triggered the event, which is accessed through "event.target.value".
     */
    
    //Search key Hanlder
    handleSearchKey(event){
        //console.log(event.target.value);
        this.filters={...this.filters,"searchKey" :event.target.value}
        this.sendDataToCarList()
    }

    //Price handler
    handlePriceChange(event){
        //console.log(event.target.value);
        this.filters={...this.filters,"maxPrice" :event.target.value}
        this.sendDataToCarList()
    } 
    
    //  This function is called when a checkbox is clicked.

    handleCheckbox(event){

        //If this is the first time the function is called for a given filter, initialize the filter values with all available options.
        if(!this.filters.categories){
            //Get all available categories from the categories data object.
            const categories = this.categories.data.values.map(item=>item.value)
            //Get all available make types from the make type data object.
            const makeType = this.makeType.data.values.map(item=>item.value)
            //Add the new categories and make type values to the filters object.
            this.filters = {...this.filters, categories, makeType}
        }
        // Get the name and value of the checkbox that was clicked.
        const {name, value} = event.target.dataset
        // console.log("name", name)
        // console.log("value", value)

        //If the checkbox is checked:
        if(event.target.checked){
            //If the filter does not already include the clicked value, add it.
            if(!this.filters[name].includes(value)){
                // Add the clicked value to the filter array.
                this.filters[name] = [...this.filters[name], value]
            }
        } else { //If the checkbox is unchecked:

            // Remove the clicked value from the filter array.
            this.filters[name] =  this.filters[name].filter(item=>item !==value)
        }
        //Send the updated filter values to the car list component.
        this.sendDataToCarList()
    }



    sendDataToCarList(){
        //This line clears any existing timer that may have been started previously.
        window.clearTimeout(this.timer)
        // Start a new timer to send the filtered cars data to the car list component
        this.timer = window.setTimeout(()=>{
            // Use the `publish` method from the `messageContext` to send the message with the filtered cars data
            publish(this.messageContext, CARS_FILTERED_MESSAGE, {

                /* This is part of an object that is being passed as the payload of the CARS_FILTERED_MESSAGE event.
                 The this.filters object is a property of the component and stores the currently selected filter 
                 values for categories and make types.*/
                filters:this.filters
            })
        }, 400)
        
    }
}