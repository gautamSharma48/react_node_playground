import { forcaset, geocode } from "./gecode";

const url =
  "https://api.openweathermap.org/data/2.5/weather?lat=28.7142349&lon=77.1636016&appid=1a790be26fdd371a4950bef9bb87dd6c&units=metric";

const geocodeURL = "";


geocode(url, (error,data) => {
  console.log(data);
});

forcaset(28.7142349,77.1636016,(error,data)=>{
  console.log(error);
  console.log(data);
})
