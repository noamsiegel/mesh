// Weather code type definition
interface WeatherCode {
  main: string;
  description: string;
  icon: string;
}

// Weather codes mapping
export const weatherCodes: { [key: number]: WeatherCode } = {
  0: { main: "Clear", description: "Clear sky", icon: "01d" },
  1: { main: "Clear", description: "Mainly clear", icon: "01d" },
  2: { main: "Clouds", description: "Partly cloudy", icon: "02d" },
  3: { main: "Clouds", description: "Overcast", icon: "03d" },
  45: { main: "Fog", description: "Fog", icon: "50d" },
  48: { main: "Fog", description: "Depositing rime fog", icon: "50d" },
  51: { main: "Drizzle", description: "Light drizzle", icon: "09d" },
  53: { main: "Drizzle", description: "Moderate drizzle", icon: "09d" },
  55: { main: "Drizzle", description: "Dense drizzle", icon: "09d" },
  56: { main: "Drizzle", description: "Light freezing drizzle", icon: "09d" },
  57: { main: "Drizzle", description: "Dense freezing drizzle", icon: "09d" },
  61: { main: "Rain", description: "Slight rain", icon: "10d" },
  63: { main: "Rain", description: "Moderate rain", icon: "10d" },
  65: { main: "Rain", description: "Heavy rain", icon: "10d" },
  66: { main: "Rain", description: "Light freezing rain", icon: "13d" },
  67: { main: "Rain", description: "Heavy freezing rain", icon: "13d" },
  71: { main: "Snow", description: "Slight snow fall", icon: "13d" },
  73: { main: "Snow", description: "Moderate snow fall", icon: "13d" },
  75: { main: "Snow", description: "Heavy snow fall", icon: "13d" },
  77: { main: "Snow", description: "Snow grains", icon: "13d" },
  80: { main: "Rain", description: "Slight rain showers", icon: "09d" },
  81: { main: "Rain", description: "Moderate rain showers", icon: "09d" },
  82: { main: "Rain", description: "Violent rain showers", icon: "09d" },
  85: { main: "Snow", description: "Slight snow showers", icon: "13d" },
  86: { main: "Snow", description: "Heavy snow showers", icon: "13d" },
  95: { main: "Thunderstorm", description: "Thunderstorm", icon: "11d" },
  96: { main: "Thunderstorm", description: "Thunderstorm with slight hail", icon: "11d" },
  99: { main: "Thunderstorm", description: "Thunderstorm with heavy hail", icon: "11d" },
};

// Get current date in YYYY-MM-DD format
export function getCurrentDate(): string {
  // Use UTC to ensure consistency across different server environments
  return formatDate(new Date());
}

// Get date X days from now in YYYY-MM-DD format
export function getDatePlusDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

// Format a date as YYYY-MM-DD
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Get weather info for a code
export function getWeatherInfo(code: number): WeatherCode {
  return weatherCodes[code] || {
    main: "Unknown",
    description: "Unknown weather",
    icon: "50d",
  };
}

// Get weather description for a code
export function getWeatherDescription(code: number): string {
  return getWeatherInfo(code).description;
}

// Get weather main category for a code
export function getWeatherMain(code: number): string {
  return getWeatherInfo(code).main;
}

// Get weather icon for a code
export function getWeatherIcon(code: number): string {
  return getWeatherInfo(code).icon;
}

// Custom error classes
export class WeatherError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WeatherError';
  }
}

export class InvalidDateRangeError extends WeatherError {
  constructor(date: string, timezone: string) {
    super(`Date ${date} is outside the valid range for timezone ${timezone}`);
    this.name = 'InvalidDateRangeError';
  }
}

export class InvalidCheckInDateError extends WeatherError {
  constructor(checkInDate: string, today: string, timezone: string) {
    super(`Check-in date ${checkInDate} cannot be before today (${today}) in timezone ${timezone}`);
    this.name = 'InvalidCheckInDateError';
  }
}

// Validate a date range
export function validateDateRange(date: string, timezone: string): void {
  const today = new Date();
  today.setHours(0, 0, 0, 0);  // Normalize to start of day
  
  const inputDate = new Date(date);
  inputDate.setHours(0, 0, 0, 0);  // Normalize to start of day

  // Check if the date is before today (check-in date validation)
  if (inputDate < today) {
    throw new InvalidCheckInDateError(date, formatDate(today), timezone);
  }
  
  const maxDate = new Date();
  maxDate.setHours(0, 0, 0, 0);  // Normalize to start of day
  maxDate.setDate(today.getDate() + 16); // maxForecastDays from constants

  // Check if the date is within the valid range
  if (inputDate > maxDate) {
    throw new InvalidDateRangeError(date, timezone);
  }
}

// Validate booking dates
export function validateBookingDates(checkInDate: string, checkOutDate: string, timezone: string): void {
  const today = new Date();
  today.setHours(0, 0, 0, 0);  // Normalize to start of day
  
  const checkIn = new Date(checkInDate);
  checkIn.setHours(0, 0, 0, 0);  // Normalize to start of day
  
  const checkOut = new Date(checkOutDate);
  checkOut.setHours(0, 0, 0, 0);  // Normalize to start of day
  
  // Calculate date 15 days from check-in date
  const maxDate = new Date(checkIn);
  maxDate.setHours(0, 0, 0, 0);  // Normalize to start of day
  maxDate.setDate(checkIn.getDate() + 15);

  // Check if check-in date is not before today
  if (checkIn < today) {
    throw new InvalidCheckInDateError(checkInDate, formatDate(today), timezone);
  }

  if (checkOut > maxDate) {
    throw new Error(`Check-out date (${checkOutDate}) cannot be more than 15 days from check-in date (${formatDate(maxDate)})`);
  }

  if (checkIn > checkOut) {
    throw new Error(`Check-in date (${checkInDate}) cannot be after check-out date (${checkOutDate})`);
  }
}
