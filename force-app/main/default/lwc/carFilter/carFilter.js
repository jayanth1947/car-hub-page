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

    @wire(getPicklistValues,{
        recordTypeId:'$carObjectInfo.data.defaultRecordTypeId',
        fieldApiName:CATEGORY_FIELD
    })categories


    // Fetching Making PickList
    @wire(getPicklistValues,{
        recordTypeId:'$carObjectInfo.data.defaultRecordTypeId',
        fieldApiName:MAKE_FIELD
    })makeType

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

    
        if(!this.filters.categories){
            const categories = this.categories.data.values.map(item=>item.value)
            const makeType = this.makeType.data.values.map(item=>item.value)
            this.filters = {...this.filters, categories, makeType}
        }
        // Get the name and value of the checkbox that was clicked.
        const {name, value} = event.target.dataset
        // console.log("name", name)
        // console.log("value", value)

        //If the checkbox is checked:
        if(event.target.checked){
            if(!this.filters[name].includes(value)){
                this.filters[name] = [...this.filters[name], value]
            }
        } else { 
            this.filters[name] =  this.filters[name].filter(item=>item !==value)
        }
        this.sendDataToCarList()
    }

    sendDataToCarList(){
        window.clearTimeout(this.timer)
        this.timer = window.setTimeout(()=>{
            publish(this.messageContext, CARS_FILTERED_MESSAGE, {
                filters:this.filters
            })
        }, 400)
        
    }
}