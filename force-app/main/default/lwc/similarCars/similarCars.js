import { api, LightningElement, wire } from 'lwc';

import CAR_OBJECT from '@salesforce/schema/Car__c';
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c';
import getSimilarCars from '@salesforce/apex/carController.getSimilarCars';
import { getRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
export default class SimilarCars extends NavigationMixin(LightningElement) {

    @api recordId
    @api objectApiName

    objectApiName=CAR_OBJECT
    similarCars

    @wire(getRecord,{recordId:'$recordId',fields:[MAKE_FIELD]})
    car

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