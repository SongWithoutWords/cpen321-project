import React, { Component } from "react";
import { View, ScrollView, AppRegistry } from "react-native";
import PrescriptionCardComponent from "../components/cardComponents/PrescriptionCardComponent";
import { hook } from "cavy";

const fake_prescriptions = [
  {
    name: "divalproex",
    avatar_url: "https://bit.ly/2yhPJY0",
    subtitle: "..",
    image_name: "divalproex" // index into the images array in the card component
  },
  {
    name: "amoxicillin",
    avatar_url: "https://bit.ly/2yhPJY0",
    subtitle: "..",
    image_name: "amoxicillin"
  },
  {
    name: "divalproex",
    avatar_url: "https://bit.ly/2yhPJY0",
    subtitle: "..",
    image_name: "divalproex" // index into the images array in the card component
  },
  {
    name: "amoxicillin",
    avatar_url: "https://bit.ly/2yhPJY0",
    subtitle: "..",
    image_name: "amoxicillin"
  },
];

class PrescriptionListScreen extends Component {
  onPress = () => {
    this.props.navigation.navigate("PrescriptionInfo");
  };

  render() {
    return (
      <View>
        <ScrollView>
          {fake_prescriptions.map((prescription,i) => {
            return (
              <PrescriptionCardComponent
                ref={this.props.generateTestHook('PrescriptionCardComponent')}
                title={prescription.name}
                subtitle={prescription.subtitle}
                image_name={prescription.image_name}
                onPress={this.onPress}
                key={i}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  }
}


export default hook(PrescriptionListScreen);
AppRegistry.registerComponent('PrescriptionListScreen', () => PrescriptionListScreen);