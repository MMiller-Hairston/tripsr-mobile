import React, { Component } from "react";
import { Image, Platform, Text, View } from "react-native";
import { Constants, Location, Permissions } from "expo";

export default class App extends React.Component {
  state = {
    location: {},
    geolocation: null,
    errorMessage: null
  };

  componentWillMount() {
    if (Platform.OS === "android" && !Constants.isDevice) {
      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      });
    } else {
      this._getLocationAsync().then(() => this._reverseGeocodeAsync());
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location: {latitude: location.coords.latitude, longitude: location.coords.longitude} });
  };

  _reverseGeocodeAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }

    let location = {latitude: this.state.location.latitude, longitude: this.state.location.longitude}
    let geolocation = await Location.reverseGeocodeAsync(location);
    this.setState({ geolocation: geolocation[0] }, () => console.log(this.state));
  };

  render() {
    let text = "Waiting..";
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.geolocation) {
      text = this.state.geolocation;
    }

    return (
      <View style={styles.container}>
        <Text>Location: {text.city}, {text.region} {text.country}</Text>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20
  }
};
