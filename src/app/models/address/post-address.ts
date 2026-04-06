import { Address } from "./address"
import { Locality } from "./locality";

export class PostAddress {
    id: string = '';
    address: Address = new Address();
    locality: Locality = new Locality();

}