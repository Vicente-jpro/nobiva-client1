import { inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HouseCreateRequest } from "../../models/house/house-create-request";
import { PostAddress } from "../../models/address/post-address";
import { Locality } from "../../models/address/locality";

export class HouseFormBuilder {
    formBuilder = inject(FormBuilder);

    build(house: HouseCreateRequest): FormGroup {
        return this.formBuilder.group({
            title: [house.title, [Validators.required, Validators.minLength(5)]],
            description: [house.description, [Validators.required, Validators.minLength(3)]],
            avaliable: [house.avaliable],
            number_of_rooms: [house.number_of_rooms, [Validators.required, Validators.min(1)]],
            tipology: [house.tipology, [Validators.required, Validators.minLength(2)]],
            status_post: [house.status_post, [Validators.required, Validators.minLength(3)]],
            status_condition: [house.status_condition, [Validators.required, Validators.minLength(3)]],
            type_negotiation: [house.type_negotiation, [Validators.required, Validators.minLength(3)]],
            furnished: [house.furnished],
            swimming_pool: [house.swimming_pool],
            kitchen: [house.kitchen, [Validators.required, Validators.min(1)]],
            backyard: [house.backyard],
            bathroom: [house.bathroom, [Validators.required, Validators.min(1)]],
            price: [house.price, [Validators.required, Validators.min(10)]],
            post_address: this.buldPostAddress(house.post_address)
        });
    }

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
        });
    }
}