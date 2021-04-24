import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import firebase from "firebase";

import { EntryStackScreen } from "./screens/EntryStackScreen";

const firebaseConfig = require("./keys.json");
if (firebase.apps.length == 0) {
    firebase.initializeApp(firebaseConfig);
}

const App = () => {
    return (
        <SafeAreaProvider>
            <EntryStackScreen />
        </SafeAreaProvider>
    );
}

export default App;