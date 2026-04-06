import { PostAddress } from "../address/post-address";

export class HouseCreateRequest {
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
    post_address: PostAddress = new PostAddress();
		
}
