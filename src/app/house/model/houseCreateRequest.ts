export interface HouseCreateRequest {
    title: string;
	description: string;
	avaliable: boolean;
	number_of_rooms: number;
	tipology: string;
	status_post: string;
	status_condition: string;
	type_negotiation: string;
	furnished: boolean; 
    swimming_pool: boolean;
    kitchen: number;
    backyard: boolean;
	bathroom: number;
    price: number;
    post_address: {
        address: {
            street1: string;
            street2: string;
            zipeCode: string;
        },
        locality:{
            id: number;
        }

    }
		
}
