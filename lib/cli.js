#!/usr/bin/env node
'use strict';

var _react = _interopRequireWildcard(require('react'));

var _ink = require('ink');

var _inkGradient = _interopRequireDefault(require('ink-gradient'));

var _inkBigText = _interopRequireDefault(require('ink-big-text'));

var _inkLink = _interopRequireDefault(require('ink-link'));

var _inkTextInput = _interopRequireDefault(require('ink-text-input'));

var _inkSelectInput = _interopRequireDefault(require('ink-select-input'));

var _nodeFetch = _interopRequireDefault(require('node-fetch'));

var _fs = _interopRequireDefault(require('fs'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};
    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc =
            Object.defineProperty && Object.getOwnPropertyDescriptor
              ? Object.getOwnPropertyDescriptor(obj, key)
              : {};
          if (desc.get || desc.set) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
    }
    newObj.default = obj;
    return newObj;
  }
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

const configPath = 'config.json';
const CURRENT = 'current';
const FORECAST = 'forecast';

class Weather extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, 'handleApiKeyTextChange', apiKeyText => {
      this.setState({
        apiKeyText,
      });
    });

    _defineProperty(this, 'handleCountryCodeTextChange', countryCodeText => {
      this.setState({
        countryCodeText,
      });
    });

    _defineProperty(this, 'handleCityNameTextChange', cityNameText => {
      this.setState({
        cityNameText,
      });
    });

    _defineProperty(this, 'handleApiKeySubmit', apiKey => {
      const noWhiteSpaceApiKey = apiKey.replace(/\s/g, '');
      const config = JSON.parse(_fs.default.readFileSync(configPath));
      this.setState({
        apiKey: noWhiteSpaceApiKey,
      });

      _fs.default.writeFileSync(
        configPath,
        JSON.stringify({...config, apiKey: noWhiteSpaceApiKey})
      );
    });

    _defineProperty(this, 'handleCityNameSubmit', cityName => {
      const config = JSON.parse(_fs.default.readFileSync(configPath));
      this.setState({
        cityName,
      });

      _fs.default.writeFileSync(configPath, JSON.stringify({...config, cityName}));
    });

    _defineProperty(this, 'handleCountryCodeSubmit', countryCode => {
      const noWhiteSpaceCountryCode = countryCode.replace(/\s/g, '');
      const config = JSON.parse(_fs.default.readFileSync(configPath));
      this.setState({
        countryCode: noWhiteSpaceCountryCode,
      });

      _fs.default.writeFileSync(
        configPath,
        JSON.stringify({...config, countryCode: noWhiteSpaceCountryCode})
      );
    });

    _defineProperty(this, 'handleUnitsSubmit', ({value: units}) => {
      const config = JSON.parse(_fs.default.readFileSync(configPath));
      this.setState({
        units,
      });

      _fs.default.writeFileSync(configPath, JSON.stringify({...config, units}));
    });

    _defineProperty(this, 'fetchWeather', type => {
      const {apiKey, cityName, countryCode, units} = this.state;
      return (0, _nodeFetch.default)(
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
    });

    _defineProperty(this, 'displayWeather', async option => {
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
    });

    _defineProperty(this, 'selectUserInput', (apiKey, cityName, countryCode, units) => {
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
        return _react.default.createElement(
          _ink.Box,
          null,
          _react.default.createElement(
            _ink.Box,
            {
              marginRight: 1,
            },
            'API Key:'
          ),
          _react.default.createElement(_inkTextInput.default, {
            showCursor: true,
            value: apiKeyText,
            onChange: this.handleApiKeyTextChange,
            onSubmit: this.handleApiKeySubmit,
          })
        );
      } else if (!cityName) {
        return _react.default.createElement(
          _ink.Box,
          null,
          _react.default.createElement(
            _ink.Box,
            {
              marginRight: 1,
            },
            'City Name:'
          ),
          _react.default.createElement(_inkTextInput.default, {
            showCursor: true,
            value: cityNameText,
            onChange: this.handleCityNameTextChange,
            onSubmit: this.handleCityNameSubmit,
          })
        );
      } else if (!countryCode) {
        return _react.default.createElement(
          _ink.Box,
          null,
          _react.default.createElement(
            _ink.Box,
            {
              marginRight: 1,
            },
            'Country Code (ISO 3166):'
          ),
          _react.default.createElement(_inkTextInput.default, {
            showCursor: true,
            value: countryCodeText,
            onChange: this.handleCountryCodeTextChange,
            onSubmit: this.handleCountryCodeSubmit,
          })
        );
      } else if (!units) {
        return _react.default.createElement(
          _ink.Box,
          null,
          _react.default.createElement(
            _ink.Box,
            {
              marginRight: 1,
            },
            'Units:'
          ),
          _react.default.createElement(_inkSelectInput.default, {
            items: unitItems,
            onSelect: this.handleUnitsSubmit,
          })
        );
      }
    });

    this.state = {
      apiKeyText: '',
      countryCodeText: '',
      cityNameText: '',
    };
  }

  componentDidMount() {
    let config;

    if (_fs.default.existsSync(configPath)) {
      config = JSON.parse(_fs.default.readFileSync(configPath));
    } else {
      _fs.default.writeFileSync(
        configPath,
        JSON.stringify({
          apiKey: '',
        })
      );
    }

    if (config) this.setState(config);
  }

  static renderCurrent(data) {
    const {wind, main, weather} = data;
    const {temp, pressure, humidity, temp_min, temp_max} = main;
    return _react.default.createElement(
      _ink.Color,
      {
        blue: true,
      },
      _react.default.createElement(
        _ink.Box,
        {
          flexDirection: 'column',
          padding: 1,
          width: 25,
        },
        _react.default.createElement(
          _ink.Box,
          {
            justifyContent: 'center',
          },
          'Current Weather'
        ),
        _react.default.createElement(_ink.Text, null, '-----------------------'),
        _react.default.createElement(
          _ink.Box,
          {
            justifyContent: 'space-between',
          },
          _react.default.createElement(
            _ink.Box,
            {
              marginRight: 1,
            },
            'Conditions:'
          ),
          _react.default.createElement(_ink.Box, null, weather[0].main)
        ),
        _react.default.createElement(
          _ink.Box,
          {
            justifyContent: 'space-between',
          },
          _react.default.createElement(
            _ink.Box,
            {
              marginRight: 1,
            },
            'Current Temp:'
          ),
          _react.default.createElement(_ink.Box, null, temp.toFixed(2))
        ),
        _react.default.createElement(
          _ink.Box,
          {
            justifyContent: 'space-between',
          },
          _react.default.createElement(
            _ink.Box,
            {
              marginRight: 1,
            },
            "Today's High:"
          ),
          _react.default.createElement(_ink.Box, null, temp_max.toFixed(2))
        ),
        _react.default.createElement(
          _ink.Box,
          {
            justifyContent: 'space-between',
          },
          _react.default.createElement(
            _ink.Box,
            {
              marginRight: 1,
            },
            "Today's Low:"
          ),
          _react.default.createElement(_ink.Box, null, temp_min.toFixed(2))
        ),
        _react.default.createElement(
          _ink.Box,
          {
            justifyContent: 'space-between',
          },
          _react.default.createElement(
            _ink.Box,
            {
              marginRight: 1,
            },
            'Humidity:'
          ),
          _react.default.createElement(_ink.Box, null, humidity.toFixed(2))
        ),
        _react.default.createElement(
          _ink.Box,
          {
            justifyContent: 'space-between',
          },
          _react.default.createElement(
            _ink.Box,
            {
              marginRight: 1,
            },
            'Pressure:'
          ),
          _react.default.createElement(_ink.Box, null, pressure.toFixed(2))
        ),
        _react.default.createElement(
          _ink.Box,
          {
            justifyContent: 'space-between',
          },
          _react.default.createElement(
            _ink.Box,
            {
              marginRight: 1,
            },
            'Wind:'
          ),
          _react.default.createElement(_ink.Box, null, wind.speed.toFixed(2))
        )
      )
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
    return _react.default.createElement(
      _ink.Color,
      {
        blue: true,
      },
      _react.default.createElement(
        _ink.Box,
        null,
        forecast.map(({temp, weather, wind, rain, hours}, idx) =>
          _react.default.createElement(
            _ink.Box,
            {
              key: idx,
              flexDirection: 'column',
              padding: 1,
              width: 25,
            },
            _react.default.createElement(
              _ink.Box,
              {
                justifyContent: 'center',
              },
              `${hours} Hours`
            ),
            _react.default.createElement(_ink.Text, null, '-----------------------'),
            _react.default.createElement(
              _ink.Box,
              {
                justifyContent: 'space-between',
              },
              _react.default.createElement(
                _ink.Box,
                {
                  marginRight: 1,
                },
                'Average Temp:'
              ),
              _react.default.createElement(_ink.Box, null, temp.toFixed(2))
            ),
            _react.default.createElement(
              _ink.Box,
              {
                justifyContent: 'space-between',
              },
              _react.default.createElement(
                _ink.Box,
                {
                  marginRight: 1,
                },
                'Conditions:'
              ),
              _react.default.createElement(_ink.Box, null, weather)
            ),
            _react.default.createElement(
              _ink.Box,
              {
                justifyContent: 'space-between',
              },
              _react.default.createElement(
                _ink.Box,
                {
                  marginRight: 1,
                },
                'Wind:'
              ),
              _react.default.createElement(_ink.Box, null, wind.toFixed(2))
            ),
            _react.default.createElement(
              _ink.Box,
              {
                justifyContent: 'space-between',
              },
              _react.default.createElement(
                _ink.Box,
                {
                  marginRight: 1,
                },
                'Rain:'
              ),
              _react.default.createElement(_ink.Box, null, rain.toFixed(2), ' (mm)')
            )
          )
        )
      )
    );
  }

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
    return _react.default.createElement(
      _react.default.Fragment,
      null,
      _react.default.createElement(
        _inkGradient.default,
        {
          name: 'mind',
        },
        _react.default.createElement(_inkBigText.default, {
          text: 'weather',
        })
      ),
      apiKey && cityName && countryCode && units
        ? _react.default.createElement(_inkSelectInput.default, {
            items: items,
            onSelect: this.displayWeather,
          })
        : _react.default.createElement(
            _ink.Box,
            {
              flexDirection: 'column',
            },
            _react.default.createElement(
              _ink.Box,
              {
                flexGrow: 1,
              },
              'Get your api key from',
              ' ',
              _react.default.createElement(
                _inkLink.default,
                {
                  url: 'https://home.openweathermap.org/users/sign_up',
                },
                _react.default.createElement(_ink.Color, null, 'OpenWeatherMap')
              ),
              ' ',
              'and enter it.'
            ),
            this.selectUserInput(apiKey, cityName, countryCode, units)
          )
    );
  }
}

const app = (0, _ink.render)(_react.default.createElement(Weather, null));
