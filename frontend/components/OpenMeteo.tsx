import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const LAT = 53.2992;
const LON = 1.8017;

interface CurrentWeather {
  temperature: number;
  weathercode: number;
}
interface DailyForecast {
  time: string;
  temperature_2m_max: number;
  temperature_2m_min: number;
  weathercode: number;
}

// 2. map codes → icon names
const iconMap: Record<
  number,
  React.ComponentProps<typeof MaterialCommunityIcons>["name"]
> = {
  0: "weather-sunny" as const,
  1: "weather-partly-cloudy" as const,
  2: "weather-cloudy" as const,
  3: "weather-cloudy" as const,
  45: "weather-fog" as const,
  48: "weather-fog" as const,
  51: "weather-rainy" as const,
  53: "weather-rainy" as const,
  55: "weather-hail" as const,
  56: "weather-hail" as const,
  57: "weather-hail" as const,
  61: "weather-rainy" as const,
  63: "weather-rainy" as const,
  65: "weather-pouring" as const,
  66: "weather-pouring" as const,
  67: "weather-pouring" as const,
  71: "weather-snowy" as const,
  73: "weather-snowy" as const,
  75: "weather-snowy-heavy" as const,
  77: "snowflake-alert" as const,
  80: "weather-pouring" as const,
  81: "weather-pouring" as const,
  82: "weather-pouring" as const,
  95: "weather-lightning" as const,
  96: "weather-lightning-rainy" as const,
  99: "weather-lightning-rainy" as const,
};

export default function OpenMeteoWeather() {
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [daily, setDaily] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
      `&current_weather=true` +
      `&daily=temperature_2m_max,temperature_2m_min,weathercode` +
      `&timezone=auto`;

    async function load() {
      try {
        const res = await fetch(url);
        const json = await res.json();
        if (!json.current_weather || !json.daily) {
          throw new Error("Invalid response");
        }
        setCurrent(json.current_weather);
        const zipped = json.daily.time.map((t: string, i: number) => ({
          time: t,
          temperature_2m_max: json.daily.temperature_2m_max[i],
          temperature_2m_min: json.daily.temperature_2m_min[i],
          weathercode: json.daily.weathercode[i],
        }));
        setDaily(zipped.slice(1, 5));
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <ActivityIndicator style={styles.center} size="large" />;
  if (error) return <Text style={styles.center}>{error}</Text>;
  if (!current) return <Text style={styles.center}>No data</Text>;

  // 3. render with icons
  return (
    <View style={styles.container}>
      <Text style={styles.location}>Hope Valley, Peak District</Text>
      <View style={styles.currentRow}>
        <MaterialCommunityIcons
          name={iconMap[current.weathercode] || "weather-cloudy"}
          size={60}
        />
        <Text style={styles.temp}>{Math.round(current.temperature)}°C</Text>
      </View>
      <FlatList
        data={daily}
        keyExtractor={(d) => d.time}
        horizontal
        contentContainerStyle={styles.forecastList}
        renderItem={({ item }) => {
          const weekday = new Date(item.time).toLocaleDateString("en-US", {
            weekday: "short",
          });
          return (
            <View style={styles.day}>
              <Text style={styles.dayLabel}>{weekday}</Text>
              <MaterialCommunityIcons
                name={iconMap[item.weathercode] || "weather-cloudy"}
                size={32}
              />
              <Text style={styles.dayTemp}>
                {Math.round(item.temperature_2m_max)}° /
                {Math.round(item.temperature_2m_min)}°
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: {
    width: "100%",
    padding: 16,
    backgroundColor: "#E8F4FD",
    minHeight: 250,
    borderRadius: 12,
  },
  location: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  currentRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  temp: { fontSize: 40, marginLeft: 8 },
  forecastList: { paddingVertical: 8 },
  day: {
    alignItems: "center",
    marginHorizontal: 6,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  dayLabel: { fontSize: 14, marginBottom: 4 },
  dayTemp: { fontSize: 13 },
});
