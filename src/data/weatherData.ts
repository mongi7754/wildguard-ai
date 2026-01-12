// Real-time weather data simulation for Kenya's parks
import { realKenyaParks, RealPark } from './kenyaParksRealData';

export interface ParkWeatherData {
  parkId: string;
  parkName: string;
  lat: number;
  lng: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  precipitation: number;
  visibility: number;
  pressure: number;
  uvIndex: number;
  conditions: string;
  fireRisk: 'low' | 'moderate' | 'high' | 'extreme';
  fireRiskScore: number;
  lastUpdated: Date;
  forecast: {
    time: string;
    temperature: number;
    humidity: number;
    conditions: string;
    fireRisk: number;
  }[];
  alerts: {
    type: 'heat' | 'wind' | 'drought' | 'fire' | 'storm';
    message: string;
    severity: 'advisory' | 'warning' | 'critical';
  }[];
}

const CONDITIONS = ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Hot & Dry', 'Hazy', 'Windy'];
const WIND_DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

// Seasonal temperature ranges for Kenya (varies by region and altitude)
const getSeasonalBase = (park: RealPark): { tempBase: number; humidityBase: number } => {
  const month = new Date().getMonth();
  const isDrySeason = month >= 5 && month <= 9; // June-September
  
  // Higher altitude parks are cooler
  const altitudeFactor = park.id.includes('mount') || park.id === 'aberdare' ? -8 : 0;
  // Northern parks are hotter
  const latFactor = park.lat > 0 ? 4 : park.lat < -2 ? -2 : 0;
  
  return {
    tempBase: 25 + altitudeFactor + latFactor + (isDrySeason ? 2 : -1),
    humidityBase: isDrySeason ? 45 : 65
  };
};

const calculateFireRisk = (temp: number, humidity: number, windSpeed: number, conditions: string): { level: 'low' | 'moderate' | 'high' | 'extreme'; score: number } => {
  let score = 0;
  
  // Temperature contribution (0-35 points)
  if (temp >= 35) score += 35;
  else if (temp >= 32) score += 28;
  else if (temp >= 28) score += 18;
  else if (temp >= 24) score += 10;
  else score += 5;
  
  // Humidity contribution (0-35 points) - inverse relationship
  if (humidity <= 20) score += 35;
  else if (humidity <= 35) score += 28;
  else if (humidity <= 50) score += 18;
  else if (humidity <= 65) score += 8;
  else score += 0;
  
  // Wind speed contribution (0-20 points)
  if (windSpeed >= 40) score += 20;
  else if (windSpeed >= 30) score += 15;
  else if (windSpeed >= 20) score += 10;
  else if (windSpeed >= 10) score += 5;
  else score += 0;
  
  // Conditions contribution (0-10 points)
  if (conditions.includes('Dry') || conditions.includes('Hot')) score += 10;
  else if (conditions.includes('Clear')) score += 5;
  else if (conditions.includes('Rain')) score -= 15;
  else if (conditions.includes('Cloudy')) score += 0;
  
  score = Math.max(0, Math.min(100, score));
  
  let level: 'low' | 'moderate' | 'high' | 'extreme';
  if (score >= 75) level = 'extreme';
  else if (score >= 55) level = 'high';
  else if (score >= 35) level = 'moderate';
  else level = 'low';
  
  return { level, score };
};

export const generateParkWeatherData = (): ParkWeatherData[] => {
  return realKenyaParks.map(park => {
    const { tempBase, humidityBase } = getSeasonalBase(park);
    
    // Add some variation
    const temperature = tempBase + (Math.random() * 8 - 4);
    const humidity = humidityBase + (Math.random() * 20 - 10);
    const windSpeed = Math.random() * 35 + 5;
    const windDirection = WIND_DIRECTIONS[Math.floor(Math.random() * WIND_DIRECTIONS.length)];
    
    // Conditions based on humidity
    let conditions: string;
    if (humidity > 70 && Math.random() > 0.5) {
      conditions = 'Light Rain';
    } else if (temperature > 32 && humidity < 40) {
      conditions = 'Hot & Dry';
    } else if (windSpeed > 25) {
      conditions = 'Windy';
    } else {
      conditions = CONDITIONS[Math.floor(Math.random() * 4)];
    }
    
    const { level: fireRisk, score: fireRiskScore } = calculateFireRisk(temperature, humidity, windSpeed, conditions);
    
    // Generate forecast
    const forecast = [];
    for (let i = 0; i < 6; i++) {
      const forecastTemp = temperature + (Math.random() * 6 - 3);
      const forecastHumidity = Math.max(15, Math.min(95, humidity + (Math.random() * 20 - 10)));
      forecast.push({
        time: `${(new Date().getHours() + i * 2) % 24}:00`,
        temperature: Math.round(forecastTemp),
        humidity: Math.round(forecastHumidity),
        conditions: CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)],
        fireRisk: calculateFireRisk(forecastTemp, forecastHumidity, windSpeed, conditions).score
      });
    }
    
    // Generate alerts
    const alerts: ParkWeatherData['alerts'] = [];
    if (fireRisk === 'extreme') {
      alerts.push({
        type: 'fire',
        message: 'Extreme fire danger - All units on high alert',
        severity: 'critical'
      });
    } else if (fireRisk === 'high') {
      alerts.push({
        type: 'fire',
        message: 'High fire risk - Increased patrols recommended',
        severity: 'warning'
      });
    }
    if (temperature > 35) {
      alerts.push({
        type: 'heat',
        message: 'Heat advisory in effect',
        severity: temperature > 38 ? 'warning' : 'advisory'
      });
    }
    if (windSpeed > 35) {
      alerts.push({
        type: 'wind',
        message: 'High wind warning - Drone operations may be affected',
        severity: 'warning'
      });
    }
    if (humidity < 25) {
      alerts.push({
        type: 'drought',
        message: 'Low humidity - Vegetation is dry',
        severity: 'advisory'
      });
    }
    
    return {
      parkId: park.id,
      parkName: park.name,
      lat: park.lat,
      lng: park.lng,
      temperature: Math.round(temperature * 10) / 10,
      humidity: Math.round(Math.max(15, Math.min(95, humidity))),
      windSpeed: Math.round(windSpeed),
      windDirection,
      precipitation: conditions.includes('Rain') ? Math.random() * 10 : 0,
      visibility: conditions.includes('Hazy') ? 5 + Math.random() * 5 : 15 + Math.random() * 10,
      pressure: 1010 + Math.random() * 20 - 10,
      uvIndex: Math.floor(Math.random() * 8 + 3),
      conditions,
      fireRisk,
      fireRiskScore,
      lastUpdated: new Date(),
      forecast,
      alerts
    };
  });
};

// Calculate network-wide statistics
export const getNetworkWeatherStats = (weatherData: ParkWeatherData[]) => {
  const avgTemp = weatherData.reduce((sum, w) => sum + w.temperature, 0) / weatherData.length;
  const avgHumidity = weatherData.reduce((sum, w) => sum + w.humidity, 0) / weatherData.length;
  const avgFireRisk = weatherData.reduce((sum, w) => sum + w.fireRiskScore, 0) / weatherData.length;
  
  const extremeFireParks = weatherData.filter(w => w.fireRisk === 'extreme');
  const highFireParks = weatherData.filter(w => w.fireRisk === 'high');
  const totalAlerts = weatherData.reduce((sum, w) => sum + w.alerts.length, 0);
  
  return {
    avgTemp: Math.round(avgTemp * 10) / 10,
    avgHumidity: Math.round(avgHumidity),
    avgFireRisk: Math.round(avgFireRisk),
    extremeFireCount: extremeFireParks.length,
    highFireCount: highFireParks.length,
    totalAlerts,
    extremeFireParks: extremeFireParks.map(p => p.parkName),
    highFireParks: highFireParks.map(p => p.parkName)
  };
};
