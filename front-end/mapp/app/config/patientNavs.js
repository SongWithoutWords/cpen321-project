import React from "react";
import { View } from "react-native";
import { AppRegistry } from "react-native";
import settings from "../config/settings";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createMaterialTopTabNavigator } from "react-navigation";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createStackNavigator } from "react-navigation";
import PatientRequestScreen from "../screens/PatientRequestScreen";
import AccountScreen from "../screens/AccountScreen";
import PrescriptionInfoScreen from "../screens/PrescriptionInfoScreen";
import PrescriptionListScreen from "../screens/PrescriptionListScreen";
import DoctorListScreen from "../screens/DoctorListScreen";
import DoctorInfoScreen from "../screens/DoctorInfoScreen";
import { genTabNavOptions } from "../lib/genNavOptions";

function NotificationScreen() {
  return <View />;
}

// stack navigators
const PrescriptionStackNavigator = createStackNavigator({
  PrescriptionList: {
    screen: PrescriptionListScreen,
    navigationOptions: {
      header: null,
      headerForceInset: { top: "never", bottom: "never" }
    }
  },
  PrescriptionInfo: {
    screen: PrescriptionInfoScreen,
    navigationOptions: {
      title: "Prescription Info",
      headerForceInset: { top: "never", bottom: "never" }
    }
  }
});

const DoctorStackNavigator = createStackNavigator({
  DoctorList: {
    screen: DoctorListScreen,
    navigationOptions: {
      header: null,
      headerForceInset: { top: "never", bottom: "never" }
    }
  },
  DoctorInfo: {
    screen: DoctorInfoScreen,
    navigationOptions: {
      title: "Doctor Info",
      headerForceInset: { top: "never", bottom: "never" }
    }
  }
});

const InboxTabNavigator = createMaterialTopTabNavigator(
  {
    PendingRequests: {
      screen: PatientRequestScreen,
      navigationOptions: {
        tabBarLabel: "Pending Requests",
        header: null,
        headerForceInset: { top: "never", bottom: "never" }
      }
    },
    Notifications: {
      screen: NotificationScreen,
      navigationOptions: {
        tabBarLabel: "Notifications",
        header: null,
        headerForceInset: { top: "never", bottom: "never" }
      }
    }
  },
  {
    initialRouteName: "PendingRequests",
    tabBarOptions: {
      activeTintColor: settings.ACTIVE_COLOR,
      inactiveTintColor: settings.ACTIVE_COLOR,
      upperCaseLabel: false,
      style: {
        backgroundColor: settings.THEME_COLOR 
      }
    },
    order: ["PendingRequests", "Notifications"]
  }
);

const PatientTabNavOptions = genTabNavOptions("PrescriptionList", [
  "Inbox",
  "PrescriptionList",
  "DoctorList",
  "Account"
]);

// tab navigator for patient
const PatientTabNavigator = createMaterialBottomTabNavigator(
  {
    Inbox: {
      screen: InboxTabNavigator,
      navigationOptions: {
        tabBarLabel: "Inbox",
        tabBarIcon: ({ tintColor }) => (
          <MaterialCommunityIcons name="inbox" size={25} color={tintColor} />
        )
      }
    },
    PrescriptionList: {
      screen: PrescriptionStackNavigator,
      navigationOptions: {
        tabBarLabel: "Prescriptions",
        tabBarIcon: ({ tintColor }) => (
          <MaterialCommunityIcons name="pill" size={25} color={tintColor} />
        )
      }
    },
    DoctorList: {
      screen: DoctorStackNavigator,
      navigationOptions: {
        tabBarLabel: "Doctors",
        tabBarIcon: ({ tintColor }) => (
          <MaterialCommunityIcons name="doctor" size={25} color={tintColor} />
        )
      }
    },
    Account: {
      screen: AccountScreen,
      navigationOptions: {
        tabBarLabel: "Account",
        tabBarIcon: ({ tintColor }) => (
          <MaterialCommunityIcons
            name="account-circle"
            size={25}
            color={tintColor}
          />
        )
      }
    }
  },
  PatientTabNavOptions
);
export default PatientTabNavigator;
AppRegistry.registerComponent("PatientTabNavigator", () => PatientTabNavigator);
