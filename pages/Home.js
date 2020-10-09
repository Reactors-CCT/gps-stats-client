import React from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
//  Importing GoogleFonts
import {
  useFonts,
  Raleway_400Regular,
  Raleway_700Bold,
} from "@expo-google-fonts/raleway";
//  Importing socket.io-client and connecting to the server
import io from "socket.io-client";

var dev = false;
var hostname = dev
  ? "http://localhost:3000"
  : "https://gps-stats-server.herokuapp.com";
console.log("Connecting to " + hostname);
const socket = io.connect(hostname);

//  Showing Home Screen Components
export default function Home({ navigation }) {
  // Loading fonts
  useFonts({
    Raleway_400Regular,
    Raleway_700Bold,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.team}>Reactors</Text>
      <Image style={styles.logo} source={require("../assets/logo.png")} />
      <View style={styles.padd}>
        <Button
          color="grey"
          variant="contained"
          onPress={() => {
            navigation.navigate("FindMe", { socket });
          }}
          title="FIND ME"
        />
      </View>
    </View>
  );
}

//  Stylesheet for Home
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#02b2e8",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 150,
  },
  team: {
    color: "#ffffff",
    fontFamily: "Raleway_700Bold",
    fontSize: 35,
  },
  padd: {
    fontFamily: "Raleway_400Regular",
    marginTop: 10,
    width: "30%",
  },
});
