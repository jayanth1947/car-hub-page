import { api, LightningElement } from 'lwc';

export default class CarTile extends LightningElement {
    @api car={}

    // This method is used to execute the event when the car is selected
    handleClick(){
        this.dispatchEvent(new CustomEvent('selected',{
            detail:this.car.Id
        }))
    }
}