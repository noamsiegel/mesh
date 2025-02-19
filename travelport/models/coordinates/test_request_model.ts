import { BaseHotelSearchRequest, BasePropertyFilter, StayDetails, RoomFilter, RateFilter, Radius } from '../base_request';



interface CoordinatesLocationDetails {
	latitude: string;
	longitude: string;
}

interface CoordinatesLocationType {
	type: "coordinates";
	details: CoordinatesLocationDetails;
	radius: Radius;
}

interface CoordinatesPropertyFilter extends BasePropertyFilter {
	location: CoordinatesLocationType;
}

// export interface CoordinatesHotelSearchRequest extends BaseHotelSearchRequest {
// 	propertyFilter: CoordinatesPropertyFilter;
// }

export class CoordinatesHotelSearchRequest implements BaseHotelSearchRequest {
  // From BaseHotelSearchRequest:
  responseFields?: string[];
  requestedCurrency?: string;
  stayDetails: StayDetails;
  roomFilter?: RoomFilter;
  rateFilter?: RateFilter;

  // Specific to CoordinatesHotelSearchRequest
  propertyFilter: CoordinatesPropertyFilter;
  
  constructor(opts: { 
    propertyFilter: CoordinatesPropertyFilter;
    stayDetails: StayDetails;
    responseFields?: string[];
    requestedCurrency?: string;
    roomFilter?: RoomFilter;
    rateFilter?: RateFilter;
  }) {
    this.propertyFilter = opts.propertyFilter;
    this.stayDetails = opts.stayDetails;
    this.responseFields = opts.responseFields;
    this.requestedCurrency = opts.requestedCurrency;
    this.roomFilter = opts.roomFilter;
    this.rateFilter = opts.rateFilter;
  }
}