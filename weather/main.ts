import axios, { AxiosError } from 'axios';
import {
  BASE_URL,
  DEFAULT_HTTP_TIMEOUT,
  DEFAULT_LATITUDE,
  DEFAULT_LONGITUDE,
  DEFAULT_TEMPERATURE_UNIT,
  DEFAULT_WIND_SPEED_UNIT,
  DEFAULT_PRECIPITATION_UNIT,
  DEFAULT_TIMEZONE,
  DEFAULT_TIMEFORMAT,
  DEFAULT_UNIT,
  UNIT_IMPERIAL,
  UNIT_METRIC,
  IMPERIAL_TEMPERATURE_UNIT,
  IMPERIAL_WIND_SPEED_UNIT,
  IMPERIAL_PRECIPITATION_UNIT,
  METRIC_TEMPERATURE_UNIT,
  METRIC_WIND_SPEED_UNIT,
  METRIC_PRECIPITATION_UNIT,
  MIN_LATITUDE,
  MAX_LATITUDE,
  MIN_LONGITUDE,
  MAX_LONGITUDE,
  DefaultFinder,
  DEFAULT_DAILY_PARAMS,
} from './constants';

import {
  getCurrentDate,
  getDatePlusDays,
  getWeatherDescription,
  getWeatherMain,
  getWeatherIcon,
  validateDateRange,
  validateBookingDates,
} from './helpers';

import {
  WeatherDataParams,
  WeatherDataResponse,
  DailyItem,
  OpenMeteoResponse,
  Daily,
} from './types';

import {
  ErrorTypes,
  WeatherError,
  createInvalidCheckInDateError,
  createInvalidDateRangeError,
  createInvalidCoordinatesError,
  createAPIError,
  isErrorType,
} from './errors';

// Cache types
interface CacheKey {
  lat: number;
  lon: number;
  startDate: string;
  endDate: string;
  unit: string;
}

interface CacheEntry {
  response: WeatherDataResponse;
  expiry: Date;
}

// Weather Service class
export class WeatherService {
  private client: ReturnType<typeof axios.create>;
  private cache: Map<string, CacheEntry>;
  private readonly cacheDuration = 15 * 60 * 1000; // 15 minutes in milliseconds

  constructor() {
    this.client = axios.create({
      timeout: DEFAULT_HTTP_TIMEOUT,
      headers: {
        'Accept-Encoding': 'gzip, deflate',
      },
    });
    this.cache = new Map();
  }

  private getCacheKey(key: CacheKey): string {
    return `${key.lat},${key.lon},${key.startDate},${key.endDate},${key.unit}`;
  }

  private getCachedResponse(key: CacheKey): WeatherDataResponse | null {
    const cacheKey = this.getCacheKey(key);
    const entry = this.cache.get(cacheKey);
    
    if (!entry || Date.now() > entry.expiry.getTime()) {
      return null;
    }
    
    return entry.response;
  }

  private setCachedResponse(key: CacheKey, response: WeatherDataResponse): void {
    const cacheKey = this.getCacheKey(key);
    this.cache.set(cacheKey, {
      response,
      expiry: new Date(Date.now() + this.cacheDuration),
    });
  }

  private async fetchDirectData(
    lat: number,
    lon: number,
    startDate: string,
    endDate: string,
    timezone?: string
  ): Promise<{ status: string; results: Array<{ date: string; sunrise: string; sunset: string }> }> {
    let url = `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lon}&date_start=${startDate}&date_end=${endDate}`;
    
    if (timezone) {
      url += `&timezone=${encodeURIComponent(timezone)}`;
    }

    try {
      const response = await this.client.get<{ status: string; results: Array<{ date: string; sunrise: string; sunset: string }> }>(url);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw createAPIError(error.response?.status || 500, error.message);
      }
      throw error;
    }
  }

  private async fetchWeatherData(
    lat: number,
    lon: number,
    startDate: string,
    endDate: string,
    tempUnit: string,
    windUnit: string,
    precipUnit: string,
    timezone?: string
  ): Promise<OpenMeteoResponse> {
    const params = new URLSearchParams({
      latitude: lat.toFixed(4),
      longitude: lon.toFixed(4),
      daily: DEFAULT_DAILY_PARAMS.join(','),
      current_weather: 'true',
      start_date: startDate,
      end_date: endDate || startDate,
      temperature_unit: tempUnit,
      windspeed_unit: windUnit,
      precipitation_unit: precipUnit,
      timezone: timezone || DEFAULT_TIMEZONE,
      timeformat: 'iso8601'
    });

    try {
      console.log('Fetching weather data with params:', Object.fromEntries(params));
      const response = await this.client.get<OpenMeteoResponse>(`${BASE_URL}?${params}`);
      console.log('OpenMeteo API Response:', JSON.stringify(response.data, null, 2));
      if (response.data.error) {
        throw createAPIError(400, response.data.reason);
      }
      if (!response.data.daily?.time?.length) {
        throw createAPIError(400, 'No daily data available for the requested date range');
      }
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw createAPIError(error.response?.status || 500, error.message);
      }
      throw error;
    }
  }

  private createDailyItemsFromResponses(
    weatherData: OpenMeteoResponse,
    sunriseData?: { status: string; results: Array<{ date: string; sunrise: string; sunset: string }> }
  ): DailyItem[] {
    const items: DailyItem[] = [];
    const { daily } = weatherData;

    console.log('Creating daily items from weather data:', JSON.stringify(weatherData, null, 2));
    console.log('Sunrise data:', JSON.stringify(sunriseData, null, 2));

    if (!daily?.time) {
      console.log('No daily time data available');
      return items;
    }

    // Create sunrise/sunset lookup map
    const sunriseMap = new Map<string, { sunrise: string; sunset: string }>();
    if (sunriseData?.results) {
      for (const result of sunriseData.results) {
        sunriseMap.set(result.date, {
          sunrise: result.sunrise,
          sunset: result.sunset,
        });
      }
    }

    // Create daily items
    for (let i = 0; i < daily.time.length; i++) {
      const date = daily.time[i];
      const weatherCode = daily.weather_code?.[i];
      
      // Skip if required data is missing
      if (weatherCode === undefined) {
        console.log(`Skipping day ${date} due to missing weather code`);
        continue;
      }

      // Get sunrise/sunset data
      let sunrise = '';
      let sunset = '';
      const sunriseInfo = sunriseMap.get(date);
      
      if (sunriseInfo) {
        sunrise = sunriseInfo.sunrise;
        sunset = sunriseInfo.sunset;
      } else if (daily.sunrise?.[i] && daily.sunset?.[i]) {
        sunrise = daily.sunrise[i];
        sunset = daily.sunset[i];
      }

      const item: DailyItem = {
        date,
        sunrise,
        sunset,
        summary: getWeatherDescription(weatherCode),
        temp: {
          day: daily.temperature_2m_max?.[i]?.toString() || '0',
          min: daily.temperature_2m_min?.[i]?.toString() || '0',
          max: daily.temperature_2m_max?.[i]?.toString() || '0',
          night: daily.temperature_2m_min?.[i]?.toString() || '0',
          eve: daily.temperature_2m_max?.[i]?.toString() || '0',
          morn: daily.temperature_2m_min?.[i]?.toString() || '0',
        },
        feelsLike: {
          day: daily.apparent_temperature_max?.[i]?.toString() || '0',
          night: daily.apparent_temperature_min?.[i]?.toString() || '0',
          eve: daily.apparent_temperature_max?.[i]?.toString() || '0',
          morn: daily.apparent_temperature_min?.[i]?.toString() || '0',
        },
        windSpeed: daily.wind_speed_10m_max?.[i]?.toString() || '0',
        windDeg: daily.winddirection_10m_dominant?.[i]?.toString() || '0',
        windGust: daily.wind_gusts_10m_max?.[i]?.toString() || '0',
        weather: [{
          id: weatherCode.toString(),
          main: getWeatherMain(weatherCode),
          description: getWeatherDescription(weatherCode),
          icon: getWeatherIcon(weatherCode),
        }],
        clouds: '0',
        pop: ((daily.precipitation_probability_max?.[i] || 0) / 100).toString(),
        uvi: daily.uv_index_max?.[i]?.toString() || '0',
      };

      console.log(`Created daily item for ${date}:`, JSON.stringify(item, null, 2));
      items.push(item);
    }

    return items;
  }

  public async getWeatherData(params: WeatherDataParams): Promise<WeatherDataResponse> {
    const today = getCurrentDate();
    const startDate = params.checkInDate;
    const endDate = params.checkOutDate;
    
    let lat = DEFAULT_LATITUDE;
    let lon = DEFAULT_LONGITUDE;
    let unit = DEFAULT_UNIT;
    let tempUnit = DEFAULT_TEMPERATURE_UNIT;
    let windUnit = DEFAULT_WIND_SPEED_UNIT;
    let precipUnit = DEFAULT_PRECIPITATION_UNIT;

    // Parse and validate coordinates
    if (params?.latitude) {
      const latVal = parseFloat(params.latitude);
      if (isNaN(latVal) || latVal < MIN_LATITUDE || latVal > MAX_LATITUDE) {
        throw createInvalidCoordinatesError(latVal, lon, params?.timezone || DEFAULT_TIMEZONE);
      }
      lat = latVal;
    }

    if (params?.longitude) {
      const lonVal = parseFloat(params.longitude);
      if (isNaN(lonVal) || lonVal < MIN_LONGITUDE || lonVal > MAX_LONGITUDE) {
        throw createInvalidCoordinatesError(lat, lonVal, params?.timezone || DEFAULT_TIMEZONE);
      }
      lon = lonVal;
    }

    // Set units based on unit parameter
    if (params?.unit) {
      unit = params.unit;
      switch (unit) {
        case UNIT_IMPERIAL:
          tempUnit = IMPERIAL_TEMPERATURE_UNIT;
          windUnit = IMPERIAL_WIND_SPEED_UNIT;
          precipUnit = IMPERIAL_PRECIPITATION_UNIT;
          break;
        case UNIT_METRIC:
          tempUnit = METRIC_TEMPERATURE_UNIT;
          windUnit = METRIC_WIND_SPEED_UNIT;
          precipUnit = METRIC_PRECIPITATION_UNIT;
          break;
        default:
          throw new WeatherError(
            'INVALID_UNIT',
            `Invalid unit: ${unit}. Must be either 'metric' or 'imperial'`,
            { unit }
          );
      }
    }

    // Detect timezone based on coordinates
    let timezone = DEFAULT_TIMEZONE;
    if (DefaultFinder) {
      timezone = DefaultFinder.getTimezoneName(lon, lat);
    }

    // Validate dates
    try {
      validateDateRange(startDate, timezone);
      validateDateRange(endDate, timezone);
      validateBookingDates(startDate, endDate, timezone);
    } catch (error) {
      if (error instanceof Error) {
        if (isErrorType(error, ErrorTypes.INVALID_DATE_RANGE)) {
          throw createInvalidDateRangeError(startDate, timezone);
        }
        if (isErrorType(error, ErrorTypes.INVALID_CHECK_IN_DATE) || error.name === 'InvalidCheckInDateError') {
          throw createInvalidCheckInDateError(startDate, today, timezone);
        }
      }
      throw error;
    }

    // Check cache
    const cacheKey: CacheKey = {
      lat,
      lon,
      startDate,
      endDate,
      unit,
    };

    const cachedResponse = this.getCachedResponse(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fetch data from both APIs
    try {
      const [weatherData, sunriseData] = await Promise.all([
        this.fetchWeatherData(lat, lon, startDate, endDate, tempUnit, windUnit, precipUnit, timezone),
        this.fetchDirectData(lat, lon, startDate, endDate, timezone),
      ]);

      // Create response
      const response: WeatherDataResponse = {
        weatherData: {
          lat: lat.toFixed(4),
          lon: lon.toFixed(4),
          timezone: weatherData.timezone,
          daily: this.createDailyItemsFromResponses(weatherData, sunriseData),
        },
      };

      // Cache the response
      this.setCachedResponse(cacheKey, response);

      return response;
    } catch (error) {
      if (error instanceof WeatherError) {
        throw error;
      }
      if (error instanceof Error) {
        throw createAPIError(500, error.message);
      }
      throw error;
    }
  }
}
