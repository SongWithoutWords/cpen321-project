import React, { Component } from "react";
import settings from "../config/settings";
import _ from "lodash";
import {
  Text,
  View,
  StyleSheet,
  AppRegistry,
  RefreshControl,
  FlatList,
  PushNotificationIOS,
  Platform
} from "react-native";
import { List, ListItem, SearchBar } from "react-native-elements";
import { setupPushNotification } from "../lib/setupPushNotification";
import { sendNotification } from "../lib/sendNotification";

//GUI testing
import toClass from 'recompose/toClass'
import { hook } from 'cavy';
const WrappedListItem = toClass(ListItem);

// note that this class now is actually "my patients" screen
// cuz unlike doctor list screen, patients' info can only accessed
// by their doctors
class PatientListScreen extends Component {
  constructor(props) {
    super(props);

    // get patient array
    const myPatientIDs = this.props.screenProps.user.myPatients;
    const patients = [];
    myPatientIDs.forEach(id => {
      patients.push(this.props.screenProps.patients.byId[id]);
    });

    this.state = {
      patients: patients
      // state used by search bar
      // an array of patients connected to this doctor
      // invariant: consistent with the patient states in redux store
    };
  }

  componentWillMount() {
    this.pushNotification = setupPushNotification(this.handleNotificationOpen);
    if (Object.keys(this.props.screenProps.pendingRequests.allIds).length > 0)
      sendNotification(
        "You have a new Patient requesting to connect to your account. Press here to go to the inbox screen",
        "You have a new Patient request!"
      );
  }

  // every time props changes update internal state: patients to
  // conform to the invariant
  componentWillReceiveProps(nextProps) {
    if (
      _.isEqual(
        nextProps.screenProps.user.myPatients,
        this.props.screenProps.user.myPatients
      )
    )
      console.log("myPatients are equal");
    else {
      const myPatientIDs = nextProps.screenProps.user.myPatients;
      const patients = [];
      myPatientIDs.forEach(id => {
        patients.push(nextProps.screenProps.patients.byId[id]);
      });
      this.setState({ patients: patients });
    }
  }

  // if new patient request send notification
  componentDidUpdate(prevProps) {
    if (
      _.isEqual(
        prevProps.screenProps.pendingRequests,
        this.props.screenProps.pendingRequests
      )
    )
      console.log("They are equal");
    else {
      console.log(
        "DEBUG: " +
          Object.keys(this.props.screenProps.pendingRequests.allIds).length +
          " " +
          Object.keys(prevProps.screenProps.pendingRequests.allIds).length
      );
      if (
        Object.keys(this.props.screenProps.pendingRequests.allIds).length -
          Object.keys(prevProps.screenProps.pendingRequests.allIds).length >
        0
      )
        sendNotification(
          "You have a new Patient requesting to connect to your account. Press here to go to the inbox screen",
          "You have a new Patient request!"
        );
    }
  }

  onPress = id => {
    console.log(id);
    this.props.navigation.navigate("PatientInfo", {
      patient: this.props.screenProps.patients.byId[id],
      user: this.props.screenProps.user
    });
  };

  handleNotificationOpen = notification => {
    this.props.navigation.navigate("Inbox");
    if (Platform.OS === "ios")
      notification.finish(PushNotificationIOS.FetchResult.NoData);
  };

  renderHeader = () => {
    return (
      <SearchBar
        ref={this.props.generateTestHook("PatientList.SearchBar")}
        round
        placeholder="Type Here..."
        lightTheme
        onChangeText={text => this.searchFilterFunction(text)}
        onClearText={() => this.searchFilterFunction("")}
        autoCorrect={false}
        clearIcon
      />
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE"
        }}
      />
    );
  };

  renderItem = ({ item }) => {
    return (
      <View style={{ backgroundColor: "white" }}>
        <WrappedListItem
          ref={this.props.generateTestHook("PatientList.patient." + item.firstName)}
          roundAvatar
          title={`${item.firstName} ${item.lastName}`}
          subtitle={item.email}
          containerStyle={{ borderBottomWidth: 0 }}
          onPress={() => this.onPress(item.id)}
          style={{
            backgroundColor: "white"
          }}
        />
      </View>
    );
  };

  searchFilterFunction = text => {
    const myPatientIDs = this.props.screenProps.user.myPatients;
    const patients = [];
    myPatientIDs.forEach(id => {
      patients.push(this.props.screenProps.patients.byId[id]);
    });
    const filteredPatients = patients.filter(patient => {
      const patientNameData = `${patient.firstName.toUpperCase()} ${patient.lastName.toUpperCase()}`;
      const textData = text.toUpperCase();
      return patientNameData.indexOf(textData) > -1; // check if query text is found inside patient's name
    });
    this.setState({ patients: filteredPatients });
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.patients}
          renderItem={this.renderItem}
          keyExtractor={item => item.id.toString()}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

// export default PatientListScreen;
export default hook(PatientListScreen);
AppRegistry.registerComponent("PatientListScreen", () => PatientListScreen);
