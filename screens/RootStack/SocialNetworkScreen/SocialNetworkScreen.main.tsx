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
import { StackNavigationProp } from "@react-navigation/stack";
import { UserModel } from "./../../../models/user";
import { BetModel } from "./../../../models/bet";
import SearchableDropdown from "react-native-searchable-dropdown";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SocialNetworkScreenStyles } from "./SocialNetworkScreen.styles";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export default function SocialNetworkScreen({ navigation }: any) {
  const [bets, setBets] = useState<BetModel[]>([]);
  const [userPics, setUserPics] = useState<
    Map<string, { pic: string; name: string }>
  >();

  const currentUserId = firebase.auth().currentUser!.uid;

  const tabBarHeight = useBottomTabBarHeight();

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

  //old way of doing things before using the dictionary
  const getUserImage = async (uid: string) => {
    const doc = await firebase.firestore().collection("users").doc(uid).get();
    console.log(doc?.data()?.profilePic);
    // const data: UserModel = doc.data();
    const profilePic: string = doc?.data()?.profilePic.profilePic;
    return profilePic;
  };

  const renderBet = ({ item }: { item: BetModel }) => {
    const onPress = () => {
      navigation.navigate("BetDetailScreen", {
        bet: item,
      });
    };

    //shouldn't be needed but some of the firebase entries don't have a date
    if (item.date_start.toDate === undefined) {
      return <></>;
    }

    return (
      <Card onPress={onPress} style={{ margin: 8 }}>
        {/* <Card.Title
          title={<Text>
            {userPics?.get(item.creator)?.name + " started a new bet: \n\n" + item.bet_name}
        </Text>}
          subtitle={ item.bet_name + "\n" +
            item.bet_desc + " • " + new Date(item.date_end).toLocaleString()
          }
          left = {() => <Avatar.Image size={40} source={{ uri: userPics?.get(item.creator)?.pic }} />}
        /> */}
        <Card.Title
          title={item.bet_type+ ", " + item.status}
          subtitle={
            item?.date_start?.toDate()?.toLocaleString() +
            " to " +
            item?.date_end?.toDate()?.toLocaleString()
          }
        />
        <Card.Content style={SocialNetworkScreenStyles.container}>
          <View style={SocialNetworkScreenStyles.container}>
            <Avatar.Image
              size={75}
              source={{ uri: userPics?.get(item.creator)?.pic }}
            />
            <View style={SocialNetworkScreenStyles.right}>
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

  const Bar = () => {
    return (
      <Appbar.Header>
        <TouchableOpacity>
          <Avatar.Image
            size={50}
            source={{ uri: userPics?.get(currentUserId)?.pic }}
          />
        </TouchableOpacity>
        <Appbar.Content title="Social Network">
          <SearchableDropdown></SearchableDropdown>
        </Appbar.Content>
        <Appbar.Action
          icon="exit-to-app"
          onPress={() => firebase.auth().signOut()}
        />
      </Appbar.Header>
    );
  };

  const ListEmptyComponent = () => {
    return (
      <Text style={{ fontSize: 32, padding: 32 }}>
        Welcome! Add a new bet by pressing the plus button!
      </Text>
    );
  };

  //probably needs to be replaced
  const height = Dimensions.get("window").height - 2 * tabBarHeight;

  return (
    <>
      <Bar />
      <View style={{ height: height }}>
        <FlatList
          data={bets}
          renderItem={renderBet}
          keyExtractor={(_: any, index: number) => "key-" + index}
          ListEmptyComponent={ListEmptyComponent}
        />
      </View>
    </>
  );
}
