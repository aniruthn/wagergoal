import React, { useState, useEffect, useReducer } from "react";
import {
  Platform,
  SafeAreaView,
  Text,
  ScrollView,
  View,
  Image,
} from "react-native";
import {
  Appbar,
  TextInput,
  Snackbar,
  Button,
  Avatar,
  Drawer,
} from "react-native-paper";
import { getFileObjectAsync } from "../../../Utils";

// See https://github.com/mmazzarolo/react-native-modal-datetime-picker
// Most of the date picker code is directly sourced from the example
import DateTimePickerModal from "react-native-modal-datetime-picker";

// See https://docs.expo.io/versions/latest/sdk/imagepicker/
// Most of the image picker code is directly sourced from the example
// import { styles } from "../NewBetScreen.styles";

import { SliderBox } from "react-native-image-slider-box";
import * as ImagePicker from "expo-image-picker";

import firebase from "firebase/app";
import "firebase/firestore";
import { BetModel } from "../../../models/bet";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackScreen";

interface Props {
  navigation: StackNavigationProp<RootStackParamList, "NewBetScreen">;
}

export default function BetDetailScreen() {
  const currentUserId = firebase.auth().currentUser!.uid;
  const [user, setUser] = useState(null);
  const [bet_name, setBetName] = useState("");
  const [bet_desc, setBetDesc] = useState("");
  const [bet_type, setBetType] = useState("");
  const creator = currentUserId;
  const [friends, setFriends] = useState<[]>([]);
  const [friendsMap, setFriendsMap] = useState<[]>([]);
  const [date_start, setDateStart] = useState("");
  const [date_end, setDateEnd] = useState("");
  const [evidence, setEvidence] = useState<string[]>([]);
  const [invited_users, setInvitedUsers] = useState<[]>([]);
  const [approved_users, setApprovedUsers] = useState<String[]>([]);
  const [status, setStatus] = useState("Pending");
  const [wager, setWager] = useState("");
  const [wager_quan, setWagerQuan] = useState("");
  const betUID = "zuRJkLF3BQWdv4sx44yY"; //temporary
  const [bet, setBet] = useState<BetModel | null>(null);
  const [visible, setVisible] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [sliderIndex, setSliderIndex] = useState(0);
  useEffect(() => {
    const obj = firebase.firestore().collection("users").doc(currentUserId);
    const betRef = firebase.firestore().collection("Bets").doc(betUID);
    obj.get().then((doc: any) => {
      // console.log(doc.data().friends);
      setUser(doc.data());
      console.log(doc.data());
    });
    betRef.get().then((doc: any) => {
      setBet(doc.data());
      // console.log("bet: ", doc.data());
    });
    setEvidence([
      "https://firebasestorage.googleapis.com/v0/b/wagergoal.appspot.com/o/HzzDM2OiJEuUUSplUP56.jpg?alt=media&token=c260e3fd-a48b-465e-8a10-246d6715e42e",
      "https://firebasestorage.googleapis.com/v0/b/wagergoal.appspot.com/o/G3W3gAL8G0SkBhcUjCXM.jpg?alt=media&token=409df596-8b0b-4b75-8875-c8c10e6f62c4",
      "https://firebasestorage.googleapis.com/v0/b/wagergoal.appspot.com/o/5wzobyqkYiZLGFmCEodl.jpg?alt=media&token=95de8b8e-a591-4a9a-9474-6e2a906adf91",
      "https://firebasestorage.googleapis.com/v0/b/wagergoal.appspot.com/o/ADVvy3rO7rH9MLtImtuy.jpg?alt=media&token=19691268-6ef2-46bb-a103-061a073f9ca9",
    ]);
  }, []);

  // Code for ImagePicker (from docs)
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const addImageEvidence = async () => {
    console.log("picking image");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    console.log("done");
    if (!result.cancelled) {
      setPhoto(result.uri);
      setEvidence([...evidence, result.uri]);
    }
  };

  // Snackbar.
  const [message, setMessage] = useState("");
  // Loading state for submit button
  const [loading, setLoading] = useState(false);

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

  // Code for SnackBar (from docs)
  const onDismissSnackBar = () => setVisible(false);
  const showError = (error: string) => {
    setMessage(error);
    setVisible(true);
  };

  const removePhotoEvidence = () => {
    console.log(evidence);
    setEvidence([
      ...evidence.slice(0, sliderIndex),
      ...evidence.slice(sliderIndex + 1),
    ]);
    console.log(evidence);
  };

  // const friendStatus = ({ invitedUser }: any) => {
  //   let color;
  //   if (invitedUser.status == "approved") {
  //     color = "#61F224";
  //   } else if (invitedUser.status == "pending") {
  //     color = "#FDC129";
  //   } else {
  //     color = "#F32B1F";
  //   }

  //   return (
  //     <View style={{ display: "flex", flexDirection: "row" }}>
  //       <Avatar.image source={{ uri: invitedUser.profilePic }} size={60} />
  //       <Drawer.Item style={{ backgroundColor: "#64ffda" }} />
  //     </View>
  //   );
  // };

  const saveEvent = async () => {
    try {
      console.log("getting file object");
      const betRef = firebase.firestore().collection("Bets").doc();
      const doc: BetModel = {
        bet_name: bet_name,
        bet_desc: bet_desc,
        bet_type: bet_type,
        creator: creator,
        date_start: date_start,
        date_end: date_end,
        evidence: evidence,
        invited_users: invited_users,
        approved_users: approved_users,
        status: status,
        wager: wager,
        wager_quan: wager_quan,
      };
      console.log("setting download url");
      await betRef.set(doc);
      setLoading(false);
      // navigation.goBack();
    } catch (error) {
      setLoading(false);
      showError(error.toString());
    }
  };
  if (currentUserId === bet?.creator) {
    return (
      <>
        <Bar />
        <ScrollView
          style={{ padding: 10, paddingBottom: 500 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text
            style={{
              fontSize: 30,
              marginBottom: 15,
              alignContent: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {`Bet: ${bet.bet_name}`}
          </Text>
          <Avatar.Image
            size={72}
            source={{ uri: user.profilePic }}
            style={{
              position: "absolute",
              top: "12%",
              marginLeft: 10,
              marginRight: 10,
            }}
          />

          <Text
            style={{
              fontSize: 16,
              marginBottom: 10,
              alignContent: "center",
              justifyContent: "center",
              textAlign: "left",
              left: "27%",
              width: "70%",
              color: "#000000",
            }}
          >
            {bet?.bet_desc}
          </Text>

          <Text
            style={{
              fontSize: 16,
              marginBottom: 3,
              alignContent: "center",
              justifyContent: "center",
              fontWeight: "bold",
              textAlign: "left",
              left: "27%",
              width: "70%",
              color: "#000000",
            }}
          >
            Wager:
          </Text>

          <Text
            style={{
              fontSize: 16,
              marginBottom: 10,
              alignContent: "center",
              justifyContent: "center",
              textAlign: "left",
              left: "34%",
              width: "60%",
              color: "#000000",
            }}
          >
            {bet?.wager}
          </Text>

          {/* <Text
            style={{
              fontSize: 24,
              alignContent: "center",
              justifyContent: "flex-start",
              textAlign: "center",
            }}
          >
            {`Evidence`}
          </Text> */}
          <Button
            mode="text"
            compact={true}
            style={{
              left: "0%",
              width: "30%",
              margin: 0,
              transform: [{ translateY: 5 }],
            }}
            onPress={() => removePhotoEvidence()}
            labelStyle={{ fontSize: 10, color: "#AD9661" }}
          >
            {"Remove"}
          </Button>
          <SliderBox
            images={evidence}
            sliderBoxHeight={170}
            currentImageEmitter={(index: any) => {
              console.log("index: ", index);
              setSliderIndex(index);
            }}
            paginationBoxStyle={{
              left: "30%",
            }}
            dotColor="#FAB72B"
            inactiveDotColor="#C1A977"
            ImageComponentStyle={{
              borderRadius: 15,
              width: "80%",
              alignContent: "center",
              justifyContent: "center",
              left: -20,
            }}
            imageLoadingColor="#2196F3"
            circleLoop
          />
          <Button
            mode="text"
            onPress={addImageEvidence}
            style={{ marginTop: 5 }}
          >
            {"Add Evidence"}
          </Button>

          <Text
            style={{
              fontSize: 14,
              alignContent: "center",
              justifyContent: "flex-start",
              textAlign: "left",
              left: "5%",
            }}
          >
            {`BET END DATE: ${bet?.date_end.toLocaleString()}`}
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Avatar.Image
              size={72}
              source={{ uri: user.profilePic }}
              style={{
                marginTop: 15,
                marginLeft: 15,
                marginRight: 10,
              }}
            />
            <Drawer.Item
              style={{
                backgroundColor: "#61F224",
                width: "60%",
                height: 40,
                transform: [{ translateY: 25 }],
              }}
              label="Approved"
            ></Drawer.Item>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Avatar.Image
              size={72}
              source={{ uri: user.profilePic }}
              style={{
                marginTop: 15,
                marginLeft: 15,
                marginRight: 10,
              }}
            />
            <Drawer.Item
              style={{
                backgroundColor: "#F32B1F",
                width: "60%",
                height: 40,
                transform: [{ translateY: 25 }],
              }}
              label="Rejected"
            ></Drawer.Item>
          </View>

          <Snackbar
            duration={3000}
            visible={visible}
            onDismiss={onDismissSnackBar}
          >
            {message}
          </Snackbar>
        </ScrollView>
      </>
    );
  } else {
    return (
      <View>
        <Text>hello</Text>
      </View>
    );
  }
}
