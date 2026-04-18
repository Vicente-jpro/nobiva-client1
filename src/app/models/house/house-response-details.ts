import { PostAddress } from "../address/post-address";

export class HouseResponseDetails {
    id = "";
    title = "";
    description = "";
    avaliable = false;
    number_of_rooms = 0;
    tipology = "";
    status_post = "";
    status_condition = "";
    type_negotiation = "";
    furnished = false; 
    swimming_pool = false;
    kitchen = 0;
    backyard = false;
    bathroom = 0;
    price = 0;
    washing_machine = false;
    equipped_kitchen = false;
    wifi = false;
    air_conditioning = false;
    tv = false;
    furnished_room = false;
    running_water = false;
    water_tank = false;
    electricity = false;
    image: string[] = [];
    post_address: PostAddress = new PostAddress();
        
}
