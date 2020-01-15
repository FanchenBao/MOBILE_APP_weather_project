# Weather Project
## Introduction
This is the first tutorial project from [_Learning React Native_](https://www.amazon.com/Learning-React-Native-Building-JavaScript/dp/1491929006), but with a bit of my
personal touch to it. It allows user to input a zip code, and returns the current weather condition of the zip code location. The app has the following functionalities:
* Only allow numeric input for zip code.
* Check zip code format validity (i.e. checking whether the input zip code is a five-digit number), with appropriate error message display.
* Check for network connectivity. If there is no internet connection, a warning will be displayed and the input box disabled.
* If a correct zip code is supplied, the app displays the city name, current weather condition, and current temperature. If an input zip code is incorrect (e.g. 99999), the app displays error message.
* Provide a "User Current Location" button to allow weather info query for the device's current location.
* Use the latest photo on device as the background via `@react-native-community/cameraroll`.
* Enable caching via `@react-native-community/async-storage`. This allows the app to load the last successful weather info query result before user makes a new query.

## Notes
1. Tested only on android devices so far.