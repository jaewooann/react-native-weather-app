import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";
// import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "cc60661ea8d6cd6378f636bd18fa23dd";

const icons = {
  Clouds: "cloudy",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(
      json.list.filter((weather) => {
        if (weather.dt_txt.includes("00:00:00")) {
          return weather;
        }
      })
    );
  };
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator
              color="white"
              style={{ marginTop: 10 }}
              size="large"
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.date}>{day.dt_txt.split(" ")[0]}</Text>
              <View>
                <Text style={styles.temp}>
                  {parseFloat(day.main.temp).toFixed(1)}
                  {/* <Fontisto name="cloudy" size={24} color="black" /> */}
                </Text>
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500",
    color: "#fff",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    justifyContent: "left",
    alignItems: "left",
  },
  date: {
    marginLeft: 10,
    marginBottom: -50,
    fontSize: 22,
    fontWeight: "500",
    color: "#fff",
  },
  temp: {
    marginTop: 50,
    marginLeft: 10,
    fontSize: 118,
    color: "#fff",
  },
  description: {
    marginTop: -20,
    marginLeft: 10,
    fontSize: 40,
    color: "#fff",
  },
  tinyText: {
    marginLeft: 10,
    fontSize: 20,
    color: "#fff",
  },
});
