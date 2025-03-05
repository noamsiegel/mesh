import { describe,expect,test,beforeEach } from "bun:test";
import { WeatherService } from './main';
import { WeatherDataParams } from './types';
import { ErrorTypes } from './errors';

describe('WeatherService',() => {
    let service: WeatherService;

    beforeEach(() => {
        service = new WeatherService();
    });

    describe('getWeatherData',() => {
        test('should fetch weather data with default parameters',async () => {
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);

            const params: WeatherDataParams = {
                checkInDate: today.toISOString().split('T')[0],
                checkOutDate: tomorrow.toISOString().split('T')[0],
            };
            const response = await service.getWeatherData(params);
            expect(response).toBeDefined();
            expect(response.weatherData).toBeDefined();
            expect(response.weatherData.daily).toBeInstanceOf(Array);
        });

        test('should fetch weather data with specific dates',async () => {
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);

            const params: WeatherDataParams = {
                checkInDate: today.toISOString().split('T')[0],
                checkOutDate: tomorrow.toISOString().split('T')[0],
            };

            const response = await service.getWeatherData(params);
            expect(response).toBeDefined();
            expect(response.weatherData.daily.length).toBeGreaterThan(0);
        });

        test('should fetch weather data with specific coordinates',async () => {
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);

            const params: WeatherDataParams = {
                latitude: '40.7128',  // New York City
                longitude: '-74.0060',
                unit: 'imperial',
                checkInDate: today.toISOString().split('T')[0],
                checkOutDate: tomorrow.toISOString().split('T')[0],
            };

            const response = await service.getWeatherData(params);
            expect(response).toBeDefined();
            expect(response.weatherData.lat).toBe(params.latitude!);
            expect(response.weatherData.lon).toBe(params.longitude!);
        });

        test('should handle metric units',async () => {
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);

            const params: WeatherDataParams = {
                unit: 'metric',
                checkInDate: today.toISOString().split('T')[0],
                checkOutDate: tomorrow.toISOString().split('T')[0],
            };

            const response = await service.getWeatherData(params);
            expect(response).toBeDefined();
            expect(response.weatherData.daily).toBeInstanceOf(Array);
        });

        test('should handle imperial units',async () => {
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);

            const params: WeatherDataParams = {
                unit: 'imperial',
                checkInDate: today.toISOString().split('T')[0],
                checkOutDate: tomorrow.toISOString().split('T')[0],
            };

            const response = await service.getWeatherData(params);
            expect(response).toBeDefined();
            expect(response.weatherData.daily).toBeInstanceOf(Array);
        });

        test('should throw error for invalid coordinates',async () => {
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);

            const params: WeatherDataParams = {
                latitude: '91',  // Invalid latitude (> 90)
                longitude: '0',
                checkInDate: today.toISOString().split('T')[0],
                checkOutDate: tomorrow.toISOString().split('T')[0],
            };

            await expect(service.getWeatherData(params)).rejects.toThrow();
        });

        test('should throw error for invalid date range',async () => {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 7);
            const pastDatePlusOne = new Date(pastDate);
            pastDatePlusOne.setDate(pastDate.getDate() + 1);

            const params: WeatherDataParams = {
                checkInDate: pastDate.toISOString().split('T')[0],
                checkOutDate: pastDatePlusOne.toISOString().split('T')[0],
            };

            await expect(service.getWeatherData(params)).rejects.toThrow();
        });

        test('should throw error for invalid unit',async () => {
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);

            const params: WeatherDataParams = {
                unit: 'invalid_unit',
                checkInDate: today.toISOString().split('T')[0],
                checkOutDate: tomorrow.toISOString().split('T')[0],
            };

            await expect(service.getWeatherData(params)).rejects.toThrow();
        });

        test('should throw specific error for invalid check-in date',async () => {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 1);
            const pastDatePlusOne = new Date(pastDate);
            pastDatePlusOne.setDate(pastDate.getDate() + 1);

            const params: WeatherDataParams = {
                checkInDate: pastDate.toISOString().split('T')[0],
                checkOutDate: pastDatePlusOne.toISOString().split('T')[0],
            };

            let errorThrown = false;
            try {
                await service.getWeatherData(params);
            } catch (error: any) {
                errorThrown = true;
                expect(error.message).toContain('check-in date');
            }
            expect(errorThrown).toBe(true);
        });

        test('should throw specific error for invalid coordinates',async () => {
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);

            const params: WeatherDataParams = {
                latitude: '100',
                longitude: '200',
                checkInDate: today.toISOString().split('T')[0],
                checkOutDate: tomorrow.toISOString().split('T')[0],
            };

            let errorThrown = false;
            try {
                await service.getWeatherData(params);
            } catch (error: any) {
                errorThrown = true;
                expect(error.message).toContain('invalid coordinates');
            }
            expect(errorThrown).toBe(true);
        });

        test('should return cached response for same parameters',async () => {
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);

            const params: WeatherDataParams = {
                latitude: '51.5074',  // London
                longitude: '-0.1278',
                checkInDate: today.toISOString().split('T')[0],
                checkOutDate: tomorrow.toISOString().split('T')[0],
            };

            const firstResponse = await service.getWeatherData(params);
            const secondResponse = await service.getWeatherData(params);

            expect(secondResponse).toEqual(firstResponse);
        });

        test('should handle custom timezone',async () => {
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);

            const params: WeatherDataParams = {
                latitude: '35.6762',  // Tokyo
                longitude: '139.6503',
                timezone: 'Asia/Tokyo',
                checkInDate: today.toISOString().split('T')[0],
                checkOutDate: tomorrow.toISOString().split('T')[0],
            };

            const response = await service.getWeatherData(params);
            expect(response).toBeDefined();
            expect(response.weatherData.timezone).toBeDefined();
        });
    });
}); 