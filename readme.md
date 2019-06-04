# ink-weather-cli

_A cli weather tool built with [Ink](https://github.com/vadimdemedes/ink), powered by OpenWeatherMap._

![2019-06-04 10 29 02](https://user-images.githubusercontent.com/4007345/58892402-bd04ff00-86b3-11e9-9b70-6f1926cb19b4.gif)

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
