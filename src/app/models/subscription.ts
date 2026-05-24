import { PlanModel } from './plan';

export class SubscriptionModel {
  id: string = '';
  type: PlanModel = new PlanModel();
  status: string = '';
  maxDuration: number = 0;
  usedDays: number = 0;
  expermetal: boolean = false;
  user?: { id: string; name: string; email: string };
}

export class SubscriptionRequest {
  PlanType?: PlanModel;
  PlanStatus?: string;
  userId?: string;
}
