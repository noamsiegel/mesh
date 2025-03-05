// Weather data request parameters
export interface WeatherDataParams {
  checkInDate: string;  // Required
  checkOutDate: string; // Required
  latitude?: string;
  longitude?: string;
  unit?: string;
  timezone?: string;
}

// Weather data response
export interface WeatherDataResponse {
  weatherData: {
    lat: string;
    lon: string;
    timezone: string;
    daily: DailyItem[];
  };
}

// Daily weather information
export interface DailyItem {
  date: string;
  sunrise: string;
  sunset: string;
  summary: string;
  temp: Temperature;
  feelsLike: FeelsLike;
  windSpeed: string;
  windDeg: string;
  windGust: string;
  weather: WeatherInfo[];
  clouds: string;
  pop: string;
  uvi: string;
}

// Temperature information
export interface Temperature {
  day: string;
  min: string;
  max: string;
  night: string;
  eve: string;
  morn: string;
}

// "Feels like" temperature information
export interface FeelsLike {
  day: string;
  night: string;
  eve: string;
  morn: string;
}

// Weather condition information
export interface WeatherInfo {
  id: string;
  main: string;
  description: string;
  icon: string;
}

// Raw response from Open Meteo API
export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  utc_offset_seconds: number;
  daily: Daily;
  daily_units: { [key: string]: string };
  error: boolean;
  reason: string;
}

// Daily weather data
export interface Daily {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  daylight_duration: number[];
  sunshine_duration: number[];
  uv_index_max: number[];
  uv_index_clear_sky_max: number[];
  precipitation_sum: number[];
  rain_sum: number[];
  showers_sum: number[];
  snowfall_sum: number[];
  precipitation_hours: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
  winddirection_10m_dominant: number[];
  shortwave_radiation_sum: number[];
  et0_fao_evapotranspiration: number[];
}

// Weather code mapping
export interface WeatherCode {
  main: string;
  description: string;
  icon: string;
}
