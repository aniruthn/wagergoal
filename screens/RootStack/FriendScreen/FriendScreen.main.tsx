import React, { useState, useEffect } from "react";
import {
  Platform,
  SafeAreaView,
  Text,
  ScrollView,
  FlatList,
} from "react-native";
import {
  Appbar,
  TextInput,
  Snackbar,
  Button,
  Card,
  Avatar,
} from "react-native-paper";
import { SearchBar } from "react-native-elements";
import { getFileObjectAsync } from "../../../Utils";

// See https://github.com/mmazzarolo/react-native-modal-datetime-picker
// Most of the date picker code is directly sourced from the example
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SearchableDropdown from "react-native-searchable-dropdown";
// import { styles } from "../NewBetScreen.styles";

import firebase from "firebase/app";
import "firebase/firestore";
import { BetModel } from "../../../models/bet";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackScreen";
import { Item } from "react-native-paper/lib/typescript/components/Drawer/Drawer";

interface Props {
  navigation: StackNavigationProp<RootStackParamList, "FriendScreen">;
}

export default function FriendScreen() {
  const currentUserId = firebase.auth().currentUser!.uid;
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState("");
  const [frd, setFrd] = useState();

  // get all user data
  useEffect(() => {
    const db = firebase.firestore();
    const unsubscribe = db
      .collection("users")
      .orderBy("firstName", "asc")
      .onSnapshot((querySnapshot: any) => {
        let newUsers: any = [];
        querySnapshot.forEach((user: any) => {
          const newUser = user.data();
          newUser.id = user.id;
          newUsers.push(newUser);
        });
        setUsers(newUsers);
      });
    // return unsubscribe;
  }, []);

  // get all friends of current users

  useEffect(() => {
    const db = firebase.firestore();
    const unsubscribe = db
      .collection("users")
      .doc(currentUserId)
      .get()
      .then((doc: any) => {
        setFriends(doc.data().friends);
      });
    // return unsubscribe;
  }, []);

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Content title="Add Friends" />
      </Appbar.Header>
    );
  };

  const renderUser = ({ item }: { item: any }) => {
    let meetsSearchCriteria =
      search === ""
        ? true
        : item.firstName.includes(search) || item.lastName.includes(search);

    const addFriend = (item) => {
      //updating newfriends

      let newfriend: any = [];
      users.forEach((user: any) => {
        if (user["id"] === item.id) {
          newfriend = user["friends"];
        }
      });
      newfriend.push(currentUserId);
      async () => {
        try {
          console.log("updating file object");
          const betRef = firebase.firestore().collection("users").doc(item.id);
          await betRef.update({ friends: newfriend });
        } catch (error) {}
      };

      //updating current users
      friends.push(item.id);
      async () => {
        try {
          console.log("updating file object");
          const betRef = firebase
            .firestore()
            .collection("users")
            .doc(currentUserId);
          await betRef.update({ friends: friends });
        } catch (error) {}
      };
    };

    const removeFriend = () => {};

    if (meetsSearchCriteria) {
      console.log(friends);
      if (!friends.includes(item.id) && item.id !== currentUserId) {
        return (
          <Card style={{ margin: 16 }}>
            <Avatar.Image
              size={72}
              source={{ uri: item.profilePic }}
              style={{
                marginTop: 15,
                marginLeft: 15,
                marginRight: 10,
              }}
            />
            <Card.Title
              style={{}}
              title={item.firstName + " " + item.lastName}
            />
            <Card.Actions>
              <Button onPress={addFriend(item)}>Add</Button>
            </Card.Actions>
          </Card>
        );
      } else if (item.id !== currentUserId) {
        return (
          <Card style={{ margin: 16 }}>
            <Avatar.Image
              size={72}
              source={{ uri: item.profilePic }}
              style={{
                marginTop: 15,
                marginLeft: 15,
                marginRight: 10,
              }}
            />
            <Card.Title title={item.firstName + " " + item.lastName} />
            <Card.Actions>
              <Button onPress={removeFriend}>Remove</Button>
            </Card.Actions>
          </Card>
        );
      }
    }
  };

  return (
    <>
      <Bar />
      <ScrollView
        style={{ padding: 20, paddingBottom: 500 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text> Friends </Text>
        <SearchBar
          placeholder="Search"
          lightTheme
          round
          editable={true}
          value={search}
          onChangeText={setSearch}
        />
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(_: any, index: number) => "key-" + index}
        />
      </ScrollView>
    </>
  );
}
