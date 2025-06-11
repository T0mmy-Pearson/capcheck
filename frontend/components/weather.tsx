import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';


const API_KEY = '5eb3f4036ea55d2153c4b16b00de5770';
const LAT = 37.78825;
const LON = -122.4324;




interface CurrentWeather {
  temp: number;
  weather: { description: string; icon: string }[];
}
interface DailyForecast {
  dt: number;
  temp: { min: number; max: number };
  weather: { icon: string }[];
}

export default function WeatherScreen() {
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [daily, setDaily] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    // 1. Build the URL once
    const url = `https://api.openweathermap.org/data/2.5/onecall`
      + `?lat=${LAT}&lon=${LON}`
      + `&exclude=minutely,hourly,alerts`
      + `&units=imperial`
      + `&appid=${API_KEY}`;
  
    async function loadWeather() {
      try {
        console.log('Fetching weather from:', url);
        const res = await fetch(url);       // now you’re fetching that valid URL
        const json = await res.json();
        console.log('OWM payload:', json);
  
        if (!res.ok) {
          throw new Error(json.message || `HTTP ${res.status}`);
        }
        if (!Array.isArray(json.daily)) {
          throw new Error('Missing daily data');
        }
  
        setCurrent(json.current);
        setDaily(json.daily.slice(1, 5));
      } catch (err: any) {
        console.error('Weather error:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  
    loadWeather();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }
  if (!current) {
    return (
      <View style={styles.center}>
        <Text>Unexpected error (no data).</Text>
      </View>
    );
  }

  const iconUrl = (icon: string) =>
    `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <View style={styles.container}>
      <Text style={styles.location}>San Francisco</Text>
      <View style={styles.current}>
        <Image
          source={{ uri: iconUrl(current.weather[0].icon) }}
          style={styles.icon}
        />
        <Text style={styles.temp}>{Math.round(current.temp)}°F</Text>
      </View>
      <Text style={styles.desc}>{current.weather[0].description}</Text>
      <FlatList
        data={daily}
        keyExtractor={(item) => item.dt.toString()}
        horizontal
        contentContainerStyle={styles.forecastList}
        renderItem={({ item }) => {
          const day = new Date(item.dt * 1000).toLocaleDateString('en-US', {
            weekday: 'short',
          });
          return (
            <View style={styles.day}>
              <Text style={styles.dayLabel}>{day}</Text>
              <Image
                source={{ uri: iconUrl(item.weather[0].icon) }}
                style={styles.smallIcon}
              />
              <Text style={styles.dayTemp}>
                {Math.round(item.temp.max)}° / {Math.round(item.temp.min)}°
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#E8F4FD',
    minHeight: 250,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  location: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 8,
  },
  current: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { width: 80, height: 80 },
  temp: { fontSize: 48, fontWeight: '200', marginLeft: 8 },
  desc: {
    fontSize: 18,
    textAlign: 'center',
    textTransform: 'capitalize',
    marginBottom: 16,
  },
  forecastList: {
    justifyContent: 'space-between',
  },
  day: {
    alignItems: 'center',
    marginHorizontal: 8,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  dayLabel: { fontSize: 16, marginBottom: 4 },
  smallIcon: { width: 40, height: 40, marginBottom: 4 },
  dayTemp: { fontSize: 14, fontWeight: '300' },
});


