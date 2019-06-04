# ink-weather-cli

_A cli weather tool built with [Ink](https://github.com/vadimdemedes/ink), powered by OpenWeatherMap._

#### Install

```
$ npm i -g ink-weather-cli
```

#### Run

```
$ weather
```

#### Config

- Get your OpenWeatherMap api key by signing up [here](https://home.openweathermap.org/users/sign_up). On first run of the cli you'll be asked to enter it.
- Enter your city name
- Enter your ISO 3166 country code. Lookup your code [here](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes).
- Select your preferred units of measure.

If you need to change any of your config settings, they are stored in the `config.json` file stored in the `..node_modules/ink-weather-cli` directory.
