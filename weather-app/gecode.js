export const geocode = (address, callback) => {
  fetch(address, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      callback(undefined, data);
    })
    .catch((err) => callback("unable to find data", undefined));
};

export const forcaset = (lat, lon, callback) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=1a790be26fdd371a4950bef9bb87dd6c&units=metric`;
  fetch(url, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      callback(undefined, data);
    })
    .catch((err) => callback("unable to find data", undefined));
};
