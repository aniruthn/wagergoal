import React, { useState, useEffect } from "react";
import { View, FlatList, Image, Dimensions } from "react-native";
import {
  Appbar,
  Button,
  Card,
  Avatar,
  Text,
  Paragraph,
  Title,
  Headline,
  Subheading,
  Caption,
} from "react-native-paper";
import firebase from "firebase/app";
import "firebase/firestore";
import { UserModel } from "./../../../models/user";
import { BetModel } from "./../../../models/bet";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AccountScreenStyles } from "./AccountScreen.styles";

export default function AccountScreen({ navigation }: any) {
  const [bets, setBets] = useState<BetModel[]>([]);
  const [userPics, setUserPics] = useState<
    Map<string, { pic: string; name: string }>
  >();

  const currentUserId = firebase.auth().currentUser!.uid;

  const [currentUserInfo, setCurrentUserInfo] = useState<
    UserModel | undefined
  >();

  useEffect(() => {
    const db = firebase.firestore();
    const unsubscribe = db
      .collection("users")
      .onSnapshot((querySnapshot: any) => {
        var dict: Map<string, { pic: string; name: string }> = new Map();
        querySnapshot.forEach((user: any) => {
          const newUser = user.data() as UserModel;
          newUser.id = user.id;
          if (newUser.id !== undefined) {
            dict.set(newUser.id, {
              pic: newUser.profilePic,
              name: newUser.firstName + " " + newUser.lastName,
            });
          }
        });
        setUserPics(dict);
      });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const db = firebase.firestore();
    const unsubscribe = db
      .collection("Bets")
      .orderBy("date_end", "asc")
      .onSnapshot((querySnapshot: any) => {
        var newBets: BetModel[] = [];
        querySnapshot.forEach((bet: any) => {
          const newBet = bet.data() as BetModel;
          newBet.id = bet.id;
          newBets.push(newBet);
        });
        setBets(newBets);
      });
    return unsubscribe;
  }, []);

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(currentUserId)
      .get()
      .then((doc) => {
        const currentUser = doc.data() as UserModel;
        setCurrentUserInfo(currentUser);
      });
  });

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Action
          icon="exit-to-app"
          onPress={() => firebase.auth().signOut()}
        />
        <Appbar.Content title="Account" />
      </Appbar.Header>
    );
  };

  const renderBet = ({ item }: { item: BetModel }) => {
    const onPress = () => {
      navigation.navigate("BetDetailScreen", {
        bet: item,
      });
    };

    //shouldn't be needed but some of the firebase entries don't have a date
    if (
      item.date_start.toDate === undefined ||
      item.creator !== currentUserId
    ) {
      return <></>;
    }

    return (
      <Card onPress={onPress} style={{ margin: 8 }}>
        <Card.Title
          title={item.bet_type + ", " + item.status}
          subtitle={
            item?.date_start?.toDate()?.toLocaleString() +
            " to " +
            item?.date_end?.toDate()?.toLocaleString()
          }
        />
        <Card.Content style={AccountScreenStyles.container}>
          <View style={AccountScreenStyles.container}>
            <Avatar.Image
              size={75}
              source={{ uri: userPics?.get(item.creator)?.pic }}
            />
            <View style={AccountScreenStyles.right}>
              <Paragraph style={{ fontSize: 18, width: "80%" }}>
                {userPics?.get(item.creator)?.name +
                  " started a new bet: \n" +
                  item.bet_name}
              </Paragraph>
              <Paragraph style={{ fontSize: 18, width: "80%" }}>
                {"Wager: \n" + item.wager + "\nQuantity: " + item.wager_quan}
              </Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const ListEmptyComponent = () => {
    return (
      <Text style={{ fontSize: 32, padding: 32 }}>
        Welcome! Add a new bet by pressing the plus button!
      </Text>
    );
  };

  return (
    <>
      <Bar />
      <Card style={{ margin: 8 }}>
        <Card.Title title="Your Account Details" />
        <Card.Content>
            <Avatar.Image
              size={75}
              source={{ uri: userPics?.get(currentUserId)?.pic }}
            />
            <View style={AccountScreenStyles.right}>
              <Paragraph style={{ fontSize: 18, width: "80%" }}>
                Name:{" "}
                {currentUserInfo?.firstName + " " + currentUserInfo?.lastName}
              </Paragraph>
              <Paragraph style={{ fontSize: 18, width: "80%" }}>
                Email: {currentUserInfo?.email}
              </Paragraph>
            </View>
        </Card.Content>
      </Card>
      <Headline style={{textAlign: "center"}}>Your Bets</Headline>
      <FlatList
        data={bets}
        renderItem={renderBet}
        keyExtractor={(_: any, index: number) => "key-" + index}
        ListEmptyComponent={ListEmptyComponent}
      />
    </>
  );
}
