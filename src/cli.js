#!/usr/bin/env node
import React, {Component} from 'react';
import {render, Color, Box, Text} from 'ink';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';
import Link from 'ink-link';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';
import fetch from 'node-fetch';
import fs from 'fs';

const configPath = 'config.json';
const CURRENT = 'current';
const FORECAST = 'forecast';

class Weather extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apiKeyText: '',
      countryCodeText: '',
      cityNameText: '',
    };
  }

  componentDidMount() {
    let config;

    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath));
    } else {
      fs.writeFileSync(configPath, JSON.stringify({apiKey: ''}));
    }

    if (config) this.setState(config);
  }

  handleApiKeyTextChange = apiKeyText => {
    this.setState({apiKeyText});
  };

  handleCountryCodeTextChange = countryCodeText => {
    this.setState({countryCodeText});
  };

  handleCityNameTextChange = cityNameText => {
    this.setState({cityNameText});
  };

  handleApiKeySubmit = apiKey => {
    const noWhiteSpaceApiKey = apiKey.replace(/\s/g, '');
    const config = JSON.parse(fs.readFileSync(configPath));

    this.setState({apiKey: noWhiteSpaceApiKey});
    fs.writeFileSync(configPath, JSON.stringify({...config, apiKey: noWhiteSpaceApiKey}));
  };

  handleCityNameSubmit = cityName => {
    const config = JSON.parse(fs.readFileSync(configPath));

    this.setState({cityName});
    fs.writeFileSync(configPath, JSON.stringify({...config, cityName}));
  };

  handleCountryCodeSubmit = countryCode => {
    const noWhiteSpaceCountryCode = countryCode.replace(/\s/g, '');
    const config = JSON.parse(fs.readFileSync(configPath));

    this.setState({countryCode: noWhiteSpaceCountryCode});
    fs.writeFileSync(configPath, JSON.stringify({...config, countryCode: noWhiteSpaceCountryCode}));
  };

  handleUnitsSubmit = ({value: units}) => {
    const config = JSON.parse(fs.readFileSync(configPath));

    this.setState({units});
    fs.writeFileSync(configPath, JSON.stringify({...config, units}));
  };

  fetchWeather = type => {
    const {apiKey, cityName, countryCode, units} = this.state;

    return fetch(
      `https://api.openweathermap.org/data/2.5/${type}?q=${cityName},${countryCode}&units=${units}&appid=${apiKey}`
    )
      .then(function(resp) {
        return resp.json();
      })
      .then(function(data) {
        return data;
      })
      .catch(function() {
        return {};
      });
  };

  static renderCurrent(data) {
    const {wind, main, weather} = data;
    const {temp, pressure, humidity, temp_min, temp_max} = main;

    return (
      <Color blue>
        <Box flexDirection="column" padding={1} width={25}>
          <Box justifyContent="center">Current Weather</Box>
          <Text>-----------------------</Text>
          <Box justifyContent="space-between">
            <Box marginRight={1}>Conditions:</Box>
            <Box>{weather[0].main}</Box>
          </Box>
          <Box justifyContent="space-between">
            <Box marginRight={1}>Current Temp:</Box>
            <Box>{temp.toFixed(2)}</Box>
          </Box>
          <Box justifyContent="space-between">
            <Box marginRight={1}>Today's High:</Box>
            <Box>{temp_max.toFixed(2)}</Box>
          </Box>
          <Box justifyContent="space-between">
            <Box marginRight={1}>Today's Low:</Box>
            <Box>{temp_min.toFixed(2)}</Box>
          </Box>
          <Box justifyContent="space-between">
            <Box marginRight={1}>Humidity:</Box>
            <Box>{humidity.toFixed(2)}</Box>
          </Box>
          <Box justifyContent="space-between">
            <Box marginRight={1}>Pressure:</Box>
            <Box>{pressure.toFixed(2)}</Box>
          </Box>
          <Box justifyContent="space-between">
            <Box marginRight={1}>Wind:</Box>
            <Box>{wind.speed.toFixed(2)}</Box>
          </Box>
        </Box>
      </Color>
    );
  }

  static renderForecast({list}) {
    function mode(array) {
      if (array.length === 0) return null;
      var modeMap = {};
      var maxEl = array[0],
        maxCount = 1;
      for (var i = 0; i < array.length; i++) {
        var el = array[i];
        if (modeMap[el] == null) modeMap[el] = 1;
        else modeMap[el]++;
        if (modeMap[el] > maxCount) {
          maxEl = el;
          maxCount = modeMap[el];
        }
      }
      return maxEl;
    }

    let count = 0;
    let temps = 0;
    let weathers = [];
    let winds = 0;
    let rains = 0;
    let forecast = [];
    let hours = 0;

    list.forEach(({main, weather, wind, rain}) => {
      count += 1;
      temps += main.temp;
      weathers.push(weather[0].main);
      winds += wind.speed;
      if (rain && rain['3h']) rains += rain['3h'];

      if (count === 8) {
        hours += 24;
        forecast.push({
          temp: temps / 8,
          weather: mode(weathers),
          wind: winds / 8,
          rain: rains,
          hours,
        });

        temps = 0;
        weathers = [];
        winds = 0;
        rains = 0;
        count = 0;
      }
    });

    return (
      <Color blue>
        <Box>
          {forecast.map(({temp, weather, wind, rain, hours}, idx) => (
            <Box key={idx} flexDirection="column" padding={1} width={25}>
              <Box justifyContent="center">{`${hours} Hours`}</Box>
              <Text>-----------------------</Text>
              <Box justifyContent="space-between">
                <Box marginRight={1}>Average Temp:</Box>
                <Box>{temp.toFixed(2)}</Box>
              </Box>
              <Box justifyContent="space-between">
                <Box marginRight={1}>Conditions:</Box>
                <Box>{weather}</Box>
              </Box>
              <Box justifyContent="space-between">
                <Box marginRight={1}>Wind:</Box>
                <Box>{wind.toFixed(2)}</Box>
              </Box>
              <Box justifyContent="space-between">
                <Box marginRight={1}>Rain:</Box>
                <Box>{rain.toFixed(2)} (mm)</Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Color>
    );
  }

  displayWeather = async option => {
    const {value} = option;
    let data = {};

    switch (value) {
      case CURRENT:
        data = await this.fetchWeather('weather');
        app.rerender(Weather.renderCurrent(data));
        break;
      case FORECAST:
        data = await this.fetchWeather('forecast');
        app.rerender(Weather.renderForecast(data));
        break;
    }
  };

  selectUserInput = (apiKey, cityName, countryCode, units) => {
    const {apiKeyText, countryCodeText, cityNameText} = this.state;
    const unitItems = [
      {
        label: 'Imperial',
        value: 'imperial',
      },
      {
        label: 'Metric',
        value: 'metric',
      },
      {
        label: 'Standard',
        value: 'standard',
      },
    ];

    if (!apiKey) {
      return (
        <Box>
          <Box marginRight={1}>API Key:</Box>
          <TextInput
            showCursor
            value={apiKeyText}
            onChange={this.handleApiKeyTextChange}
            onSubmit={this.handleApiKeySubmit}
          />
        </Box>
      );
    } else if (!cityName) {
      return (
        <Box>
          <Box marginRight={1}>City Name:</Box>
          <TextInput
            showCursor
            value={cityNameText}
            onChange={this.handleCityNameTextChange}
            onSubmit={this.handleCityNameSubmit}
          />
        </Box>
      );
    } else if (!countryCode) {
      return (
        <Box>
          <Box marginRight={1}>Country Code (ISO 3166):</Box>
          <TextInput
            showCursor
            value={countryCodeText}
            onChange={this.handleCountryCodeTextChange}
            onSubmit={this.handleCountryCodeSubmit}
          />
        </Box>
      );
    } else if (!units) {
      return (
        <Box>
          <Box marginRight={1}>Units:</Box>
          <SelectInput items={unitItems} onSelect={this.handleUnitsSubmit} />
        </Box>
      );
    }
  };

  render() {
    const {apiKey, cityName, countryCode, units} = this.state;
    const items = [
      {
        label: 'Current',
        value: CURRENT,
      },
      {
        label: 'Forecast (5 days)',
        value: FORECAST,
      },
    ];

    return (
      <>
        <Gradient name="mind">
          <BigText text="weather" />
        </Gradient>
        {apiKey && cityName && countryCode && units ? (
          <SelectInput items={items} onSelect={this.displayWeather} />
        ) : (
          <Box flexDirection="column">
            <Box flexGrow={1}>
              Get your api key from{' '}
              <Link url="https://home.openweathermap.org/users/sign_up">
                <Color>OpenWeatherMap</Color>
              </Link>{' '}
              and enter it.
            </Box>
            {this.selectUserInput(apiKey, cityName, countryCode, units)}
          </Box>
        )}
      </>
    );
  }
}

const app = render(<Weather />);
