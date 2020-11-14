navigator.geolocation.getCurrentPosition((position) => { //получаем кооординаты  устройства
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    //название города по координатам и отобразить в инпуте
    getCityName('https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&units=metric&appid=6fe566c1f95d5ec9f6584e25e48e75f5');
});

//находим город по введенному названию в инпуте
document.querySelector('.header_search_button').addEventListener('click', (event) => {
    let city = document.querySelector('.header_search_input').value;
    getCityName('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&appid=6fe566c1f95d5ec9f6584e25e48e75f5');
    event.preventDefault();
});

class Weather {
    constructor(options) {
        this.temperature = options.temperature;
        this.realFeel = options.realFeel;
        this.sunrise = options.sunrise;
        this.sunset = options.sunset;
        this.icon = options.icon;
        this.forecast = options.forecast;
        this.lat = options.lat;
        this.lon = options.lon;
        this.cityName = options.cityName;
        this.timeZone = options.timeZone;
    }

    getSunrise() {
        let timeSunrise = new Date(this.sunrise * 1000);
        return moment(timeSunrise).utcOffset(this.timeZone / 60).format('LT');
    }

    getSunset() {
        let timeSunset = new Date(this.sunset * 1000);
        return moment(timeSunset).utcOffset(this.timeZone / 60).format('LT');
    }

    getDuration() {
        let timeSunrise = new Date(this.sunrise * 1000);
        let timeSunset = new Date(this.sunset * 1000);
        return moment(timeSunset).subtract(timeSunrise.getHours(), 'hours').subtract(timeSunrise.getMinutes(), 'minutes').format("HH:mm");
    }

    getIconWeather() {
        return 'http://openweathermap.org/img/wn/' + this.icon + '@2x.png';
    }

    renderToday() {
        document.querySelector('.date_wrapper').innerHTML = moment().format('DD.MM.YYYY');
        //текущее
        document.querySelector('.temperature').innerHTML = Math.round(this.temperature) + '<sup>o</sup><span>C</span>';
        document.querySelector('.real_feel_value').innerHTML = Math.round(this.realFeel) + '<sup>o</sup>';
        document.querySelector('.sunrise').innerHTML = this.getSunrise();
        document.querySelector('.sunset').innerHTML = this.getSunset();
        document.querySelector('.duration').innerHTML = this.getDuration() + ' hr';
        document.querySelector('.clarity').innerHTML = this.forecast;
        document.querySelector('#img_weather').src = this.getIconWeather();
    }
}

class Hourly extends Weather {
    constructor(options) {
        super(options);
        this.date = options.date;
        this.wind = options.wind;
        this.day = options.day;
        this.morning = options.morning;
        this.eve = options.eve;
        this.night = options.night;
    }
}

class Forecast {
    //класс прогноза погоды почасовой и на 5дней
    constructor() {}

    renderHourly(hourlyArray) {
        //отображает данные о почасовой погоде на сегодняшний день
        let time = document.querySelectorAll('.time');
        let temp = document.querySelectorAll('.temperaure_item');
        let feel = document.querySelectorAll('.real_feel_item');
        let forecast = document.querySelectorAll('.forecast_item');
        let windSpeed = document.querySelectorAll('.wind_item');
        let iconW = document.querySelectorAll('.widget_value_icon');

        for (let i = 0; i < 6; i++) {
            time[i].innerHTML = moment(hourlyArray[i + 1].date * 1000).format("h a");
            temp[i].innerHTML = hourlyArray[i].temperature;
            feel[i].innerHTML = hourlyArray[i].realFeel;
            forecast[i].innerHTML = hourlyArray[i].forecast;
            windSpeed[i].innerHTML = hourlyArray[i].wind;
            iconW[i].src = hourlyArray[i].getIconWeather();
        }
    }

    renderDaily(dailyArray) {
        //отображение  погоды на 5 дней(вторя вкладка)
        let forecastWrapper = document.querySelectorAll('.five_days_forecast_wrapper');
        let dayHeader = document.querySelectorAll('.section_header_forecast');
        let dateTextForecast = document.querySelectorAll('.date_forecast_text');
        let forecastIcon = document.querySelectorAll('.forecast_icon');
        let temperatureForecast = document.querySelectorAll('.temperature_text');
        let forecastText = document.querySelectorAll('.forecast_text');

        for (let i = 0; i < 5; i++) {
            forecastWrapper[i].addEventListener('click', () => {
                forecastWrapper.forEach(key => {
                    key.classList.remove('forecast_selected');
                });
                forecastWrapper[i].classList.add('forecast_selected');
                this.showSelectedDay(dailyArray[i]);
            });

            dayHeader[i].innerHTML = moment(dailyArray[i].date * 1000).format('ddd');
            dateTextForecast[i].innerHTML = moment(dailyArray[i].date * 1000).format('MMM DD');
            forecastIcon[i].src = dailyArray[i].getIconWeather();
            temperatureForecast[i].innerHTML = dailyArray[i].temperature + '<sup>o</sup><span>C</span>';
            forecastText[i].innerHTML = dailyArray[i].forecast;
        }
    }

    showSelectedDay(selectedDay) {
        //отображает  выбраннный  день forecast во 2 вкладке
        document.querySelector('.date_forecast').innerHTML = moment(selectedDay.date * 1000).format('dddd');
        document.querySelector('.widget_icon_forecast').src = selectedDay.getIconWeather();
        document.querySelector('.forecast_item_description').innerHTML = selectedDay.forecast;
        document.querySelector('.forecast_temperaure_item').innerHTML = selectedDay.temperature;
        document.querySelector('.forecast_real_feel_item').innerHTML = selectedDay.realFeel;
        document.querySelector('.forecast_wind_item').innerHTML = selectedDay.wind;
        document.querySelector('#morning').innerHTML = selectedDay.morning + '<sup>o</sup>';
        document.querySelector('#day').innerHTML = selectedDay.day + '<sup>o</sup>';
        document.querySelector('#eve').innerHTML = selectedDay.eve + '<sup>o</sup>';
        document.querySelector('#night').innerHTML = selectedDay.night + '<sup>o</sup>';
    }

    showTodayTab() {
        //показать 1 вкладку текущий день
        document.querySelector('.five_days_forecast').classList.add('hidden');
        document.querySelector('.current_weather_block').classList.remove('hidden');
        document.querySelector('#forecast_weather_link').classList.remove('active');
        document.querySelector('#current_weather_link').classList.add('active');
    }

    showDaysTab() {
        //показать 2 вкладку прогноз на  5 дней
        document.querySelector('.five_days_forecast').classList.remove('hidden');
        document.querySelector('.current_weather_block').classList.add('hidden');
        document.querySelector('#current_weather_link').classList.remove('active');
        document.querySelector('#forecast_weather_link').classList.add('active');
        document.querySelectorAll('.five_days_forecast_wrapper')[0].classList.add('forecast_selected');
    }

    showNotFound() {
        //404 error
        document.querySelector('.current_weather_block').classList.add('hidden');
        document.querySelector('.five_days_forecast').classList.add('hidden');
        document.querySelector('.error').classList.remove('hidden');
    }

    hideNotFound() {
        document.querySelector('.error').classList.add('hidden');
    }

    showCityName(name) {
        if (name) {
            document.querySelector('.header_search_input').value = name; //записываем город из геолокации в инпут
        }
    }
}

let forecast = new Forecast();
let error = false;

function getCityName(url) {
    fetch(url).then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
        forecast.showTodayTab(); // отображает 1 вкладку     
        forecast.showCityName(data.name);

        //getWeather получает теукущую, дневную почасовую погоду
        getWeather('https://api.openweathermap.org/data/2.5/onecall?lat=' + data.coord.lat + '&lon=' + data.coord.lon + '&exclude=minutely&units=metric&appid=6fe566c1f95d5ec9f6584e25e48e75f5');

    }).catch(e => {
        console.log(e);
        error = true;
        forecast.showNotFound();
    });
}

//getWeather получает теукущую,почасовую погоду и дневную на 5 дней 
function getWeather(url) {
    fetch(url).then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
        let current = data.current;
        let currentWeather = new Weather({
            temperature: current.temp,
            realFeel: current.feels_like,
            sunrise: current.sunrise,
            sunset: current.sunset,
            forecast: current.weather[0].main,
            icon: current.weather[0].icon,
            lon: data.lon,
            lat: data.lat,
            timeZone: data.timezone
        });
        currentWeather.renderToday(); //отображает погоду на текущий день
        error = false;
        forecast.hideNotFound();

        document.querySelector('#forecast_weather_link').addEventListener('click', function () {
            if (error == true) {
                return;
            }

            forecast.showDaysTab(); //отображает 2 вкладку
            forecast.showSelectedDay(dailyArray[0]); // отображает прогноз на текущий (активный) день во 2 вкладке   
        });

        document.querySelector('#current_weather_link').addEventListener('click', function () {
            if (error == true) {
                return;
            }
            forecast.showTodayTab(); //отображает 1 вкладку
        });

        //почасовой прогноз погоды на текущий день
        const dataHourly = data.hourly;
        let hourlyArray = dataHourly.map(el => {
            return new Hourly({
                date: el.dt,
                temperature: Math.round(el.temp),
                realFeel: Math.round(el.feels_like),
                forecast: el.weather[0].main,
                wind: Math.round(el.wind_speed),
                icon: el.weather[0].icon
            });
        });

        forecast.renderHourly(hourlyArray); //отображает почасовой прогноз на текущий день

        //прогноз на 5 дней 
        const dataDaily = data.daily;
        let dailyArray = dataDaily.map(el => {
            return new Hourly({
                date: el.dt,
                temperature: Math.round(el.temp.day),
                realFeel: Math.round(el.feels_like.day),
                forecast: el.weather[0].main,
                wind: Math.round(el.wind_speed),
                icon: el.weather[0].icon,
                morning: Math.round(el.temp.morn),
                day: Math.round(el.temp.day),
                eve: Math.round(el.temp.eve),
                night: Math.round(el.temp.night)
            });
        });

        forecast.renderDaily(dailyArray); //отображает прогноз погоды на 5 дней

        getNearestCitiesWeather('https://api.openweathermap.org/data/2.5/find?lat=' + currentWeather.lat + '&lon=' + currentWeather.lon + '&cnt=4&units=metric&appid=6fe566c1f95d5ec9f6584e25e48e75f5');
    }).catch(err => {
        console.log(err);
        forecast.showNotFound();
    });
}

function getNearestCitiesWeather(url) {
    fetch(url).then(response => {
        return response.json();
    }).then(data => {
        console.log(data);

        let citiesNearbyList = data.list;

        let citiesNearbyArray = citiesNearbyList.map(el => {
            return new Weather({
                cityName: el.name,
                temperature: Math.round(el.main.temp),
                icon: el.weather[0].icon
            });
        });

        for (i = 0; i < 4; i++) {
            let citiesName = document.querySelectorAll('.city_name');
            let citiesIconWeather = document.querySelectorAll('.clarity_icon');
            let citiesTemperatureInfo = document.querySelectorAll('.temperature_info');

            citiesName[i].innerHTML = citiesNearbyArray[i].cityName;
            citiesIconWeather[i].src = citiesNearbyArray[i].getIconWeather();
            citiesTemperatureInfo[i].innerHTML = citiesNearbyArray[i].temperature;
        }
    }).catch(err => {
        console.log(err)
        forecast.showNotFound();
    });
}