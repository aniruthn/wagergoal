import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { SafeAreaView, View } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { AuthStackParamList } from "./../AuthStackScreen";
import firebase from "firebase";

import { AuthScreenStyles } from "./../AuthStackScreen.styles";

interface Props {
  navigation: StackNavigationProp<AuthStackParamList, "SignUpScreen">;
}

export default function SignUpScreen({ navigation }: Props) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const onDismissSnackBar = () => setVisible(false);
  const showError = (error: string) => {
    setMessage(error);
    setVisible(true);
  };

  const createAccount = () => {
    try {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          //don't do nothing
        });
    } catch (error) {
      showError(error.toString());
    }
  };

  return (
    <>
      <SafeAreaView style={AuthScreenStyles.container}>
        <Appbar.Header style={AuthScreenStyles.header}>
          <Appbar.Content title="Sign Up" style={AuthScreenStyles.title} />
        </Appbar.Header>
        <View style={AuthScreenStyles.wrapperView}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={(email: any) => setEmail(email)}
            style={{ backgroundColor: "white", marginBottom: 10 }}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={(password: any) => setPassword(password)}
            style={{ backgroundColor: "white", marginBottom: 10 }}
            secureTextEntry={true}
          />
          <Button
            mode="contained"
            onPress={createAccount}
            style={{ marginTop: 20 }}
          >
            Create An Account
          </Button>
          <Button
            mode="text"
            onPress={() => navigation.navigate("SignInScreen")}
            style={{ marginTop: 20 }}
          >
            Or, Sign In Instead
          </Button>
          <Snackbar
            duration={3000}
            visible={visible}
            onDismiss={onDismissSnackBar}
          >
            {message}
          </Snackbar>
        </View>
        
      </SafeAreaView>
    </>
  );
}
