export class HouseFilter {
  title: string = '';
  statusPost: string = '';
  locality: string = '';
  minPrice: number = 0;
  negotiation: string = '';
  maxPrice: number = 0;
  idProvince: number = 0;
  tipologies: string[] = [];

  static builder(): HouseFilterBuilder {
    return new HouseFilterBuilder();
  }
}

export class HouseFilterBuilder {
  private filter: HouseFilter = new HouseFilter();

  setTitle(title: string): HouseFilterBuilder {
    this.filter.title = title;
    return this;
  }

  setStatusPost(statusPost: string): HouseFilterBuilder {
    this.filter.statusPost = statusPost;
    return this;
  }

  setLocality(locality: string): HouseFilterBuilder {
    this.filter.locality = locality;
    return this;
  }

  setMinPrice(minPrice: number): HouseFilterBuilder {
    this.filter.minPrice = minPrice;
    return this;
  }

  setNegotiation(negotiation: string): HouseFilterBuilder {
    this.filter.negotiation = negotiation;
    return this;
  }

  setMaxPrice(maxPrice: number): HouseFilterBuilder {
    this.filter.maxPrice = maxPrice;
    return this;
  }

  setIdProvince(idProvince: number): HouseFilterBuilder {
    this.filter.idProvince = idProvince;
    return this;
  }

  setTipologies(tipologies: string[]): HouseFilterBuilder {
    this.filter.tipologies = tipologies;
    return this;
  }

  build(): HouseFilter {
    return this.filter;
  }
}