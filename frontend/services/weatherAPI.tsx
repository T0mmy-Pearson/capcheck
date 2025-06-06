/* https://tile.openweathermap.org/map/{precipitation_new}/{z}/{x}/{y}.png?appid={cede26dda2a03494927af0171d3c0b2a} */

import axios from "axios";

/* export const fetchWeatherData = () => {
    return axios.get("https://tile.openweathermap.org/map/{precipitation_new}/{z}/{x}/{y}.png?appid=cede26dda2a03494927af0171d3c0b2a")
} */

const fetchRainWeatherData = () => {
    return axios.get("https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=cede26dda2a03494927af0171d3c0b2a")
}

export default fetchRainWeatherData;