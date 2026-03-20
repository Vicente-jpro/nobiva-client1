import { HouseCreateRequest } from "./house-create-request";

export class HouseAndImage {
    house: HouseCreateRequest | null = null;
    imageFormData: FormData | null = null;
}