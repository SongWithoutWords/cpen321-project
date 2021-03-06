import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SectionList,
  AppRegistry,
  TouchableOpacity
} from "react-native";
import { List, ListItem, SearchBar, Card } from "react-native-elements";
import settings from "../config/settings";
import genAlert from "../components/generalComponents/genAlert";
import checkRequestErrors from "../lib/errors";
import postData from "../lib/postData";
import fetchAuth from "../lib/fetchAuth";
import { FETCHING_USER_FULFILLED } from "../config/constants";
import _ from "lodash";

class DoctorListScreen extends Component {
  constructor(props) {
    super(props);

    // get patient array
    const doctorIDs = this.props.screenProps.doctors.allIds;
    const doctors = [];
    doctorIDs.forEach(id => {
      doctors.push(this.props.screenProps.doctors.byId[id]);
    });

    this.state = {
      doctors: doctors
      // state used by search bar
      // an array of doctors connected to this doctor
      // invariant: consistent with the patient states in redux store
    };
  }

  componentWillMount() {
    const { email, password } = this.props.screenProps.user;
    this.props.screenProps.fetchDoctors(email, password);
  }

  requestDoctor = doctor => {
    const url = settings.REMOTE_SERVER_URL + settings.REQUESTS_RES;
    const data = { doctor: doctor.id, patient: this.props.screenProps.user.id };
    const { email, password } = this.props.screenProps.user;
    return postData(url, data, email, password)
      .then(responseJson => {
        console.log(responseJson);
      })
      .catch(error => {
        genAlert("Failed to send the request", error.message);
      });
  };
  deleteDoctorRelation = doctor => {

    const url =
      settings.REMOTE_SERVER_URL +
      settings.RELAITON_RES +
      "/" +
      doctor.relationId;
    console.log('bekhoda khari');
    console.log(doctor);
    const { email, password } = this.props.screenProps.user;
    const method = "DELETE";
    return fetchAuth({url, method, email, password})
      .then(response => {
        genAlert("Doctor deleted!");
      })
      .catch(error => {
        genAlert("Failed to delete the relationship", error.message);
    });
  }
  onPress = id => {
    this.props.navigation.navigate("DoctorInfo", {
      doctor: this.props.screenProps.doctors.byId[id],
      user: this.props.screenProps.user
    });
  };

  // every time props changes update internal state: doctors to
  // conform to the invariant
  componentWillReceiveProps(nextProps) {
    if (
      _.isEqual(nextProps.screenProps.doctors, this.props.screenProps.doctors)
    )
      console.log("They are equal");
    else {
      const doctorIDs = nextProps.screenProps.doctors.allIds;
      const doctors = [];
      doctorIDs.forEach(id => {
        doctors.push(nextProps.screenProps.doctors.byId[id]);
      });
      this.setState({ doctors: doctors });
    }
  }

  searchFilterFunction = text => {
    const doctorIDs = this.props.screenProps.doctors.allIds;
    const doctors = [];

    doctorIDs.forEach(id => {
      doctors.push(this.props.screenProps.doctors.byId[id]);
    });
    const filteredDoctors = doctors.filter(doctor => {
      const doctorNameData = `${doctor.firstName.toUpperCase()} ${doctor.lastName.toUpperCase()}`;
      const textData = text.toUpperCase();
      return doctorNameData.indexOf(textData) > -1; // check if query text is found inside patient's name
    });
    this.setState({ doctors: filteredDoctors });
  };
  render() {
    const doctors = this.props.screenProps.doctors;
    const pendingRequests = this.props.screenProps.pendingRequests;
    const requestIDs = this.props.screenProps.user.myPendingRequests;
    const requestDoctors = requestIDs.map(id => pendingRequests.byId[id].doctor.id);
    const renderAllDoctors = ({ item, index, section: { title, data } }) => <Card flexDirection= 'row'>
    <View style={{width: '50%', justifyContent:'center'}}>
    <Text style = {styles.doctorName}>{"Dr. " +
                  item.firstName +
                  " " +
                  item.lastName}</Text>
    </View>
    <View style={{width: '15%', justifyContent:'center'}}>
    <Text style = {styles.doctorName}>
                ID: {item.id}</Text>
    </View>
    <View>
    <TouchableOpacity
          style={styles.submitButton1}
          onPress={this.requestDoctor.bind(this, item)}
        >
          <Text style={styles.buttonText}> {requestDoctors.indexOf(item.id) != -1 ? 'Request Sent' : 'Send Request'}</Text>
        </TouchableOpacity>
    </View>
    </Card>
    const renderMyDoctors = ({ item, index, section: { title, data } }) => <Card flexDirection= 'row'>
    <View style={{width: '50%', justifyContent:'center'}}>
    <Text style = {styles.doctorName}>{"Dr. " +
                  item.firstName +
                  " " +
                  item.lastName}</Text>
    </View>
    <View style={{width: '15%', justifyContent:'center'}}>
    <Text style = {styles.doctorName}>
                ID: {item.id}</Text>
    </View>
    <View style={{width: '35%', justifyContent:'center', alignItems: 'center', flex:1}}>
    <TouchableOpacity
          style={styles.submitButton2}
          onPress={this.deleteDoctorRelation.bind(this, item)}
        >
          <Text style={styles.buttonText}> Delete</Text>
        </TouchableOpacity>
    </View>
    </Card>
    return (
      <View style={{ flex: 1 }}>
        <SearchBar
          round
          placeholder="Type Here..."
          lightTheme
          onChangeText={text => this.searchFilterFunction(text)}
          onClearText={() => this.searchFilterFunction("")}
          autoCorrect={false}
          clearIcon
        />
        <ScrollView style={{ flex: 1 }}>
          <SectionList
            renderItem={({ item, index, section }) => (
              <Text key={index}>{item}</Text>
            )}
            keyExtractor={item => item.id.toString()}
            renderSectionHeader={({ section: { title } }) => (
              <View
                style={{
                  marginTop: 20,
                  padding: 20,
                  height: 25,
                  justifyContent: "center",
                  backgroundColor: settings.THEME_COLOR
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 25,
                    fontFamily: "Poppins-Medium"
                  }}
                >
                  {title}
                </Text>
              </View>
            )}
            sections={[
              {
                title: "My Doctors",
                data: this.props.screenProps.user.myDoctors.map(
                  id => this.props.screenProps.doctors.byId[id]
                ),
                renderItem: renderMyDoctors
              },
              {
                title: "All Doctors",
                data: this.state.doctors.filter(doctor => this.props.screenProps.user.myDoctors.indexOf(doctor.id)==-1),
                renderItem: renderAllDoctors
              }
            ]}
          />
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  text: {
    color: "black",
    fontSize: 20
  },
  container: {
    flex: 1,
    //padding: 10,
    //height: 20,
    backgroundColor: "white"
  },
  CardStyle: {
    justifyContent: "center",
    height: 50,
    borderWidth: 1,
    padding: 8
  },
  submitButton1: {
    backgroundColor: "#009CC6",
    padding: 8,
    height: 35,
    borderRadius: 10,
    alignItems: "center",
    color: "white"
  },
  submitButton2: {
    backgroundColor: "#C60000",
    padding: 8,
    height: 35,
    borderRadius: 10,
    alignItems: "center",
    color: 'white',
  },
  buttonText: {
    color: "white",
    //fontWeight: "500",
    fontSize: 14,
    // fontFamily: 'lineto-circular-pro-medium'
  }
});
export default DoctorListScreen;
AppRegistry.registerComponent("DoctorListScreen", () => DoctorListScreen);
