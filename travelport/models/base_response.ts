export interface TravelportResponse {
    hotelsResponse: HotelsResponse;
    pagination: Pagination;
    traceId: string;
    transactionId: string;
}

export interface HotelProperty {
    id: string;
    name: string;
    chainCode?: string;
    address: {
        line1: string;
        city: string;
        countryCode: string;
        postalCode?: string;
    };
    location: {
        latitude: number;
        longitude: number;
    };
    rating?: number;
}

export interface BaseHotelSearchResponse {
    properties: HotelProperty[];
    totalCount: number;
    status: {
        success: boolean;
        messageId: string;
    };
}

// Common interfaces from both response models
export interface Pagination {
    page: number;
    pageSize: number;
    paginationToken: string;
    totalItems: number;
    totalPages: number;
}

export interface SearchPoint {
    latitude: number;
    longitude: number;
}

export interface Address {
    city: string;
    countryCode: string;
    postalCode?: string;
    street: string;
}

export interface Geolocation {
    center: Center;
}

export interface Center {
    latitude: number;
    longitude: number;
}

export interface Rating {
    provider: string;
    value: number;
}

export interface CurrencyExchangeRate {
    conversionFactor: number;
    sourceCurrency: string;
    targetCurrency: string;
}

export interface AvailabilityNote {
    authority: string;
    message: string;
}

export interface Fax {
    phoneNumber: string;
}

export interface Phone {
    phoneNumber: string;
}

export interface DistanceFromSearchPoint {
    unitOfDistance: string;
    value: number;
}

export interface ImageURL {
    caption: string;
    curatedImage: boolean;
    dimensions: Dimensions;
    imageSize: string;
    pictureCategory: number;
    url: string;
}

export interface Dimensions {
    height: number;
    width: number;
}

export interface Amenity {
    category: string;
    code: number;
    description: string;
}

export interface DataQualityScore {
    augmentedRateQualityScore: number;
    augmentedRoomQualityScore: number;
}

export interface PriceBase {
    amount: number;
}

export interface Commission {
    application: boolean;
    estimatedPercent?: boolean;
    percent?: number;
}

export interface PriceNote {
    message: string;
}

export interface PriceTotalPrice {
    amount: number;
}

export interface PriceTotalTaxes {
    amount: number;
}

export interface RateRateKey {
    authority: string;
    value: string;
}

export interface Price {
    base: PriceBase;
    commission: Commission;
    currencyCode: string;
    nightlyRatesBreakdown: NightlyRatesBreakdown[];
    perStayTaxAndFeeBreakdown?: PerStayTaxAndFeeBreakdown;
    priceNote: PriceNote;
    taxesIncludedInBase: boolean;
    totalPrice: PriceTotalPrice;
    totalTaxes?: PriceTotalTaxes;
}

export interface NightlyRatesBreakdown {
    localDate: Date;
    totalPrice?: NightlyRatesBreakdownTotalPrice;
}

export interface NightlyRatesBreakdownTotalPrice {
    amount: number;
}

export interface PerStayTaxAndFeeBreakdown {
    taxes: Tax[];
}

export interface Tax {
    description: string;
    taxCode: string;
    value?: Value;
}

export interface Value {
    amount: number;
}

export interface RateRateCodeInfo {
    rateCategory?: string;
    rateCategoryCode: number;
    rateClassificationCode: number;
    rateCode?: string;
    ratePlanID?: string;
    rateType: string;
}

export interface TravelportRate {
    accessibleRoom?: boolean;
    bookingCode: string;
    breakfastIncluded?: boolean;
    dataQualityScore: DataQualityScore;
    dinnerIncluded?: boolean;
    lunchIncluded?: boolean;
    nonSmoking: boolean;
    price: Price;
    quantity?: number;
    rateCodeInfo: RateRateCodeInfo;
    rateDescription: string;
    rateKey: RateRateKey;
    roomDescription: string;
    terms: RateTerms;
    wifiIncluded?: boolean;
}

export interface TravelportRoomType {
    bedTypes: RoomTypeBedType[];
    characteristics: Characteristics;
    estimatedRoomTypeOTACode: number;
    maxOccupancy?: number;
    rates: TravelportRate[];
    roomAmenities?: RoomAmenity[];
    shortRoomDescription: string;
    view?: RoomTypeView;
}

export interface RoomTypeBedType {
    bedType: string;
    quantity: number;
    size: string;
}

export interface Characteristics {
    accessible?: boolean;
    balconyType?: BalconyType;
    bedTypes: CharacteristicsBedType[];
    category: Category;
    class?: Class;
    locationInfo?: LocationInfo;
    maxOccupancy?: number;
    numberOfBathrooms?: number;
    numberOfBedrooms?: number;
    otherFeatures?: string[];
    view?: CharacteristicsView;
}


export interface BalconyType {
    code: number;
    description: string;
}

export interface CharacteristicsBedType {
    bedType: string;
    quantity: number;
    size: string;
}

export interface Category {
    code: number;
    description: string;
}

export interface Class {
    code: number;
    description: string;
}

export interface LocationInfo {
    floor?: string;
    proximity?: string;
}

export interface CharacteristicsView {
    code: number;
    description: string;
}

export interface RateTerms {
    cancelPenalties: TentacledCancelPenalty[];
    customerLoyaltyIDRequiredAtReservation?: boolean;
    description?: string[];
    guaranteeType: string;
    ratePaymentInfo: string;
    rateQualificationIDRequiredAtCheckIn?: boolean;
    refundable: boolean;
}

export interface TentacledCancelPenalty {
    cancelShortDescription: string;
    deadlineLocal: Date;
    penalty: TentacledPenalty;
}

export interface TentacledPenalty {
    currencyAmount: TentacledCurrencyAmount;
    estimatedAmount: boolean;
    originalPenaltyInfo?: string;
}

export interface TentacledCurrencyAmount {
    amount: number;
    currency: string;
}

export interface RoomAmenity {
    code: number;
    description: string;
}

export interface RoomTypeView {
    code: number;
    description: string;
}

export interface PropertyInfo {
    acceptedCreditCards?: string[];
    adaCompliant: boolean;
    address: Address;
    amenities?: Amenity[];
    checkInTimeLocal?: string;
    checkOutTimeLocal?: string;
    distanceFromSearchPoint: DistanceFromSearchPoint;
    email?: string;
    fax?: Fax;
    featuredPropertyInd: boolean;
    geolocation: Geolocation;
    imageURLs?: ImageURL[];
    phone?: Phone;
    ratings?: Rating[];
}

export interface PropertyItem {
    availability: boolean;
    availabilityNotes?: AvailabilityNote[];
    brandCode?: string;
    chainCode: string;
    dataQualitySummaryScore?: DataQualitySummaryScore;
    longDescription?: string;
    lowestPrivateAvailableRate?: LowestPrivateAvailableRate;
    lowestPublicAvailableRate?: LowestPublicAvailableRate;
    name: string;
    propertyCode: string;
    propertyInfo: PropertyInfo;
    roomTypes?: TravelportRoomType[];
}

export interface HotelsResponse {
    checkInDateLocal: Date;
    checkOutDateLocal: Date;
    currencyExchangeRates: CurrencyExchangeRate[];
    propertyItems: PropertyItem[];
    searchPoint: SearchPoint;
}

export interface DataQualitySummaryScore {
    propertySummary: PropertySummary;
}

export interface PropertySummary {
    averageAugmentedRateQualityScore: number;
    averageAugmentedRoomQualityScore: number;
    merchandisingQualityScore: number;
    propertyContentQualityScore: number;
}

export interface LowestPrivateAvailableRate {
    averageNightlyBase: LowestPrivateAvailableRateAverageNightlyBase;
    averageNightlyTotalPrice: LowestPrivateAvailableRateAverageNightlyTotalPrice;
    averageNightlyTotalTaxes?: LowestPrivateAvailableRateAverageNightlyTotalTaxes;
    base: LowestPrivateAvailableRateBase;
    currencyCode: string;
    rateCodeInfo: LowestPrivateAvailableRateRateCodeInfo;
    rateKey: LowestPrivateAvailableRateRateKey;
    shortRoomDescription: string;
    terms: LowestPrivateAvailableRateTerms;
    totalPrice: LowestPrivateAvailableRateTotalPrice;
    totalTaxes?: LowestPrivateAvailableRateTotalTaxes;
}

export interface LowestPrivateAvailableRateAverageNightlyBase {
    amount: number;
}

export interface LowestPrivateAvailableRateAverageNightlyTotalPrice {
    amount: number;
}

export interface LowestPrivateAvailableRateAverageNightlyTotalTaxes {
    amount: number;
}

export interface LowestPrivateAvailableRateBase {
    amount: number;
}

export interface LowestPrivateAvailableRateRateCodeInfo {
    rateCategory: string;
    rateCategoryCode: number;
    rateClassificationCode: number;
    rateCode?: string;
    ratePlanID?: string;
    rateType: string;
}

export interface LowestPrivateAvailableRateRateKey {
    authority: string;
    value: string;
}

export interface LowestPrivateAvailableRateTerms {
    cancelPenalties: PurpleCancelPenalty[];
    customerLoyaltyIDRequiredAtReservation: boolean;
    description: string[];
    guaranteeType: string;
    ratePaymentInfo: string;
    rateQualificationIDRequiredAtCheckIn: boolean;
    refundable: boolean;
}

export interface PurpleCancelPenalty {
    cancelShortDescription: string;
    deadlineLocal: Date;
    penalty: PurplePenalty;
}

export interface PurplePenalty {
    currencyAmount: PurpleCurrencyAmount;
    estimatedAmount: boolean;
    originalPenaltyInfo?: string;
}

export interface PurpleCurrencyAmount {
    amount: number;
    currency: string;
}

export interface LowestPublicAvailableRate {
    averageNightlyBase: LowestPublicAvailableRateAverageNightlyBase;
    averageNightlyTotalPrice: LowestPublicAvailableRateAverageNightlyTotalPrice;
    averageNightlyTotalTaxes?: LowestPublicAvailableRateAverageNightlyTotalTaxes;
    base: LowestPublicAvailableRateBase;
    currencyCode: string;
    rateCodeInfo: LowestPublicAvailableRateRateCodeInfo;
    rateKey: LowestPublicAvailableRateRateKey;
    shortRoomDescription: string;
    terms: LowestPublicAvailableRateTerms;
    totalPrice: LowestPublicAvailableRateTotalPrice;
    totalTaxes?: LowestPublicAvailableRateTotalTaxes;
}

export interface LowestPublicAvailableRateAverageNightlyBase {
    amount: number;
}

export interface LowestPublicAvailableRateAverageNightlyTotalPrice {
    amount: number;
}

export interface LowestPublicAvailableRateAverageNightlyTotalTaxes {
    amount: number;
}

export interface LowestPublicAvailableRateBase {
    amount: number;
}

export interface LowestPublicAvailableRateRateCodeInfo {
    rateCategoryCode: number;
    rateClassificationCode: number;
    rateType: string;
}

export interface LowestPublicAvailableRateRateKey {
    authority: string;
    value: string;
}

export interface LowestPublicAvailableRateTerms {
    cancelPenalties: FluffyCancelPenalty[];
    customerLoyaltyIDRequiredAtReservation?: boolean;
    description?: string[];
    guaranteeType: string;
    ratePaymentInfo: string;
    rateQualificationIDRequiredAtCheckIn?: boolean;
    refundable: boolean;
}

export interface FluffyCancelPenalty {
    cancelShortDescription: string;
    deadlineLocal: Date;
    penalty: FluffyPenalty;
}

export interface FluffyPenalty {
    currencyAmount: FluffyCurrencyAmount;
    estimatedAmount: boolean;
    originalPenaltyInfo?: string;
}

export interface FluffyCurrencyAmount {
    amount: number;
    currency: string;
}

export interface LowestPublicAvailableRateTotalPrice {
    amount: number;
}

export interface LowestPublicAvailableRateTotalTaxes {
    amount: number;
}

export interface LowestPrivateAvailableRateTotalPrice {
    amount: number;
}

export interface LowestPrivateAvailableRateTotalTaxes {
    amount: number;
}