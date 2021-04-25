import React, { useState, useEffect } from "react";
import { Platform, View, Text } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import firebase from "firebase/app";
import "firebase/firestore";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as SearchableDropdown from "react-native-searchable-dropdown";

// use bottom tab navigator here

export default function RootStackScreen() {
  const currentUserId = firebase.auth().currentUser!.uid;
  const [bet_name, setBetName] = useState("");
  //   const [bet_desc, setBetDesc] = useState("");
  //   const [bet_type, setBetType] = useState("");
  //   //   const creator = currentUserId;
  //   const [friends, setFriends] = useState<[]>();
  //   const [date_start, setDateStart] = useState();
  //   const [date_end, setDateEnd] = useState();
  //   const [evidence, setEvidence] = useState();
  //   const [invited_users, setInvitedUsers] = useState();
  //   const [approved_users, setApprovedUsers] = useState();
  //   const [status, setStatus] = useState("Pending");
  //   const [wager, setWager] = useState("");
  //   const [wager_quan, setWagerQuan] = useState("");
  //   const obj = firebase.firestore().collection("users").doc(currentUserId);
  //   obj.get().then((doc: any) => {
  //     setFriends(doc.data().friends);
  //     setBetName(doc.data().firstName);
  //   });

  //   // Date picker.
  //   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  //   const [visible, setVisible] = useState(false);
  //   // Snackbar.
  //   const [message, setMessage] = useState("");
  //   // Loading state for submit button
  //   const [loading, setLoading] = useState(false);

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Action
          icon="exit-to-app"
          onPress={() => firebase.auth().signOut()}
        />
        <Appbar.Content title="New Bets" />
      </Appbar.Header>
    );
  };

  return (
    <>
      <Bar />
      <View style={{ padding: 20 }}>
        <Text> Hello I am Air HI Hi .</Text>
        <Text> {currentUserId}</Text>
      </View>
    </>
  );
}
