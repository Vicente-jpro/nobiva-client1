import { TypeNegotiation } from "../../models/negotiation-type";
import { StatusCondition } from "../../models/property-condition";
import { StatusPost } from "../../models/property-status";
import { Tipology } from "../../models/property-tipology";

interface baseValueNumberOption {
  value: number;
  viewValue: string;
}

interface baseValueStringOption {
  value: string;
  viewValue: string;
}

interface ProvinceOption extends baseValueNumberOption { }

interface CountryOption extends baseValueNumberOption { }

interface LocalityOption extends baseValueNumberOption { }

interface StatusPostOption extends baseValueStringOption { }

interface TypeNegotiationOption extends baseValueStringOption { }

interface StatusPostOption extends baseValueStringOption { }

interface TypeNegotiationOption extends baseValueStringOption { }

interface TypeNegotiationOption extends baseValueStringOption { }

interface TipologyOption extends baseValueStringOption { }

interface StatusConditionOption extends baseValueStringOption { }

export abstract class HouseSelectBox {
    
    provinceOptions: ProvinceOption[] = [];
    countryOptions: CountryOption[] = [];
    localityOptions: LocalityOption[] = [];

    statusPostOptions: StatusPostOption[] = [
        { value: StatusPost.APROVADO, viewValue: StatusPost.APROVADO },
        { value: StatusPost.PENDENTE, viewValue: StatusPost.PENDENTE },
        { value: StatusPost.BLOQUEADO, viewValue: StatusPost.BLOQUEADO },
        { value: StatusPost.REPROVADO, viewValue: StatusPost.REPROVADO },
    ];

    typeNegotiationOptions: TypeNegotiationOption[] = [
        { value: TypeNegotiation.ARRENDAMENTO, viewValue: TypeNegotiation.ARRENDAMENTO },
        { value: TypeNegotiation.VENDA, viewValue: TypeNegotiation.VENDA },


    ];
    tipologyOptions: TipologyOption[] = [
        { value: Tipology.T1, viewValue: Tipology.T1 },
        { value: Tipology.T2, viewValue: Tipology.T2 },
        { value: Tipology.T3, viewValue: Tipology.T3 },
        { value: Tipology.T4, viewValue: Tipology.T4 },
        { value: Tipology.T5, viewValue: Tipology.T5 },
        { value: Tipology.T6, viewValue: Tipology.T6 },
        { value: Tipology.T7, viewValue: Tipology.T7 },
        { value: Tipology.T8, viewValue: Tipology.T8 },
        { value: Tipology.T9, viewValue: Tipology.T9 },
        { value: Tipology.Tn, viewValue: Tipology.Tn },
    ];

    statusConditionOptions: StatusConditionOption[] = [
        { value: StatusCondition.NOVO, viewValue: StatusCondition.NOVO },
        { value: StatusCondition.USADO, viewValue: StatusCondition.USADO },
    ];
}