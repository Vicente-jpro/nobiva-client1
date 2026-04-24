interface baseValueNumberOption {
  value: number;
  viewValue: string;
}

interface ProvinceOption extends baseValueNumberOption { }


export abstract class ProvinceSelectBox {
    
    provinceOptions: ProvinceOption[] = [];
  
}