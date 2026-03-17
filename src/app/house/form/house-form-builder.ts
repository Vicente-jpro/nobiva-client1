import { inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HouseCreateRequest } from "../../models/house/house-create-request";
import { PostAddress } from "../../models/address/post-address";
import { Locality } from "../../models/address/locality";

export class HouseFormBuilder {
    formBuilder = inject(FormBuilder);
    house = new HouseCreateRequest();
    
    houseForm = this.formBuilder.group({
            title: [this.house.title.trim(), [Validators.required, Validators.minLength(5)]],
            description: [this.house.description.trim(), [Validators.required, Validators.minLength(3)]],
            avaliable: [this.house.avaliable],
            number_of_rooms: [this.house.number_of_rooms, [Validators.required, Validators.min(1)]],
            tipology: [this.house.tipology.trim(), [Validators.required, Validators.maxLength(2)]],
            status_post: [this.house.status_post.trim(), [Validators.required, Validators.maxLength(3)]],
            status_condition: [this.house.status_condition.trim(), [Validators.required, Validators.minLength(3)]],
            type_negotiation: [this.house.type_negotiation.trim(), [Validators.required, Validators.minLength(3)]],
            furnished: [this.house.furnished],
            swimming_pool: [this.house.swimming_pool],
            kitchen: [this.house.kitchen, [Validators.required, Validators.min(1)]],
            backyard: [this.house.backyard],
            bathroom: [this.house.bathroom, [Validators.required, Validators.min(1)]],
            price: [this.house.price, [Validators.required, Validators.min(10)]],
            post_address: this.buldPostAddress(this.house.post_address)
        });
    

    private buldPostAddress(postAddress: PostAddress): FormGroup {
        return this.formBuilder.group({
                address: this.formBuilder.group({
                    street1: [postAddress.address.street1, [Validators.required, Validators.minLength(3)]],
                    street2: [postAddress.address.street2],
                    zipeCode: [postAddress.address.zipeCode, [Validators.required, Validators.minLength(3)]],
                }),
                locality: this.buildLocality(postAddress.locality)
            })
    }

    private buildLocality(locality: Locality): FormGroup {
        return this.formBuilder.group({
            id: [locality.id, [Validators.required, Validators.min(1)]],
            //helpers to select the country, province and locality
            countrySelected: [null, [Validators.required]],
            provinceSelected: [null, [Validators.required]],
        });
    }
}