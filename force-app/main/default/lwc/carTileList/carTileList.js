import { LightningElement,wire } from 'lwc';
//This import is used in getting the details of the cars that are came from the class apex
import getCars from '@salesforce/apex/carController.getCars';
// Importing LMS related libraries and the message channel that will be used in the component.
import { APPLICATION_SCOPE,createMessageContext, MessageContext, publish, releaseMessageContext, subscribe, unsubscribe} from 'lightning/messageService';
//This the messageChannel that is imported
import CARS_FILTERED_MESSAGE from '@salesforce/messageChannel/CarsFiltered__c';
import CAR_SELECTED_MESSAGE from '@salesforce/messageChannel/CarSelected__c';
/* https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_salesforce_modules */
export default class CarTileList extends LightningElement {

    /*The "cars" property stores the result of the getCars function,
    -  "error" property stores any error encountered while calling the getCars function,
    -  "filters" property stores the filter values to be applied to the car records, and 
    - "carFliterSubscription" property stores the subscription object that is returned when a component subscribes to a message channel. */
    cars
    error
    filters={};
    carFliterSubscription

    

    /*This @wire decorator provides a declarative way of calling the getCars function with the filter values 
    specified in the filters property. The data and error parameters of the carsHandler function handle the results
     of the getCars function. If the data is returned, it is stored in the cars property, and if there is an error, 
     it is stored in the error property. */
    @wire(getCars,{filters:'$filters'})
    carsHandler(data,error){

        if(data){
            //console.log(data);
            this.cars=data;
        }
        if(error){
            //console.error(error);
            this.error=error;
        }
    }

    /*This @wire decorator wires the MessageContext from the LMS library to the messageContext property
     of the CarTileList class. */
    @wire(MessageContext)
    messageContext

    /*The connectedCallback function is called when the component is added to the DOM.
     Here, the subscribeHandler function is called, which subscribes to the CARS_FILTERED_MESSAGE. */
    connectedCallback(){
        this.subscribeHandler()
    }

    /*The subscribeHandler function subscribes to the CARS_FILTERED_MESSAGE message channel and passes a
     callback function that is executed when a message is received. 
     - The handleFilterChanges function is called with the received message.*/
    subscribeHandler(){
        this.carFliterSubscription=subscribe(this.messageContext,CARS_FILTERED_MESSAGE,(message)=>this.handleFilterChanges(message))
    }

    /*The handleFilterChanges function updates the filters property with the new filter values received in the message.*/
    handleFilterChanges(message){
        //console.log(message.filters);
        this.filters={...message.filters}
    }


    /* It is an event handler method that is triggered when a carSelected event is fired by a child component.
     It logs the selected car's Id to the console and publishes a message to a message channel with the carId 
     as a parameter. This method is used to communicate between the child and the parent components in the application. */
    handleCarSelected(event){
        //console.log("selected car Id ",event.detail);
        publish(this.messageContext,CAR_SELECTED_MESSAGE,{
            carId:event.detail
        })
    }


    /* is a lifecycle hook method that is called when the component is removed from the DOM.
     It is used to unsubscribe from a subscription to a message channel that was created in the
    connectedCallback lifecycle hook method. This prevents memory leaks and ensures that the component 
    is properly cleaned up when it is removed from the DOM. */
    disconnectedCallback(){
        unsubscribe(this.carFliterSubscription)
        this.carFliterSubscription=null
      }
}