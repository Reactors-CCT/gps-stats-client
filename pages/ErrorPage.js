import React from "react";
import { StyleSheet, Text, View } from "react-native";
//  Importing Google Fonts
import {
  useFonts,
  Raleway_400Regular,
  Raleway_700Bold,
} from "@expo-google-fonts/raleway";
//  Importing library for Icons
import { MaterialIcons } from "@expo/vector-icons";

//  Showing Error Screen Components
export default function ErrorPage({ navigation }) {
  //  Loading fonts
  useFonts({
    Raleway_400Regular,
    Raleway_700Bold,
  });

  const error = navigation.state.params.err.message;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oops! Something went wrong!</Text>
      <Text style={styles.title}></Text>
      <MaterialIcons
        style={styles.rowSubtitle}
        name="error"
        size={60}
        color="black"
      />
      <View style={styles.rowSubtitle}>
        <Text style={styles.subtitle}>Please contact system admin!</Text>
        <Text style={styles.subtitle}>{error}</Text>
      </View>
    </View>
  );
}

//Stylesheet for ErrorPage screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#02b2e8",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    color: "#ffffff",
    fontFamily: "Raleway_700Bold",
    fontSize: 35,
    textAlign: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  rowSubtitle: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    paddingBottom: 15,
  },
  subtitle: {
    fontFamily: "Raleway_400Regular",
    fontSize: 25,
    paddingLeft: 5,
  },
});
