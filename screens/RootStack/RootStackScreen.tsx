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
import { createStackNavigator } from "@react-navigation/stack";
// import { MainStackScreen } from "./MainStack/MainStackScreen";
import NewBetScreen from "./NewBetScreen/NewBetScreen.main";
import { NavigationContainer } from "@react-navigation/native";

export type RootStackParamList = {
  Main: undefined;
  NewBetScreen: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

export function RootStackScreen() {
  const options = { headerShown: false };
  return (
    <NavigationContainer>
      <RootStack.Navigator mode="modal" initialRouteName="Main">
        {/* <RootStack.Screen
          name="Main"
          component={MainStackScreen}
          options={options}
        /> */}
        <RootStack.Screen
          name="NewBetScreen"
          options={options}
          component={NewBetScreen}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
