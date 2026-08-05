export interface ClientMessageRequest {
  email: string;
  subject: string;
  description: string;
}

export interface ClientMessageApiRequest {
  ownerEmail: string;
  clientEmail: string;
  subject: string;
  message: string;
}
