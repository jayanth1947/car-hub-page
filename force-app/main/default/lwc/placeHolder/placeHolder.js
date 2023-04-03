import { api, LightningElement } from 'lwc';

//This is a static recsource for the image
import CAR_HUB_PLACEHOLDER from '@salesforce/resourceUrl/placeHolder';

export default class PlaceHolder extends LightningElement {
    @api message
    placeHolderUrl=CAR_HUB_PLACEHOLDER
}