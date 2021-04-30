// import React, { useState, useEffect } from "react";
// import { Platform, View, Text } from "react-native";
// import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
// import firebase from "firebase/app";
// import "firebase/firestore";

// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import * as SearchableDropdown from "react-native-searchable-dropdown";

// // use bottom tab navigator here

// export default function RootStackScreen() {
//   const currentUserId = firebase.auth().currentUser!.uid;
//   //   const [bet_name, setBetName] = useState("");

//   const Bar = () => {
//     return (
//       <Appbar.Header>
//         <Appbar.Action
//           icon="exit-to-app"
//           onPress={() => firebase.auth().signOut()}
//         />
//         <Appbar.Content title="New Bets" />
//       </Appbar.Header>
//     );
//   };

//   return (
//     <>
//       <Bar />
//       <View style={{ padding: 20 }}>
//         <Text> Hello! </Text>
//         <Text> {currentUserId}</Text>
//       </View>
//     </>
//   );
// }

import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
// import { MainStackScreen } from "./MainStack/MainStackScreen";
import NewBetScreen from "./NewBetScreen/NewBetScreen.main";
import { NavigationContainer } from "@react-navigation/native";
import BetDetailScreen from "./BetDetailScreen/BetDetailScreen.main";
import SocialNetworkScreen from "./SocialNetworkScreen/SocialNetworkScreen.main";
import AccountScreen from "./AccountScreen/AccountScreen.main";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const BottomTab = createBottomTabNavigator<RootStackParamList>();

export type RootStackParamList = {
  BetDetailScreen: undefined;
  NewBetScreen: undefined;
  SocialNetworkScreen: undefined;
  AccountScreen: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

export function RootStackScreen() {
  const options = { headerShown: false };
  function TabBarIcon(props: {
    name: React.ComponentProps<typeof Ionicons>["name"];
    color: string;
  }) {
    return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
  }
  return (
    <NavigationContainer>
      <BottomTab.Navigator initialRouteName="SocialNetworkScreen" tabBarOptions={{ activeTintColor: "#c36902"}}>
        <BottomTab.Screen
          name="BetDetailScreen"
          component={BetDetailScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="newspaper-outline" color={color} />
            ),
            
          }}
        />
        <BottomTab.Screen
          name="SocialNetworkScreen"
          component={SocialNetworkScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="home-outline" color={color} />
            ),
            
          }}
        />
        <BottomTab.Screen
          name="NewBetScreen"
          options={{
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="add" color={color} />
            ),
          }}
          component={NewBetScreen}
        />
        <BottomTab.Screen
          name="AccountScreen"
          options={{
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="person-circle-outline" color={color} />
            ),
          }}
          component={AccountScreen}
        />
      </BottomTab.Navigator>
    </NavigationContainer>
  );
}
