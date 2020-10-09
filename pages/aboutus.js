import React from "react";
import { StyleSheet, Text, View } from "react-native";
//  Importing Google Fonts
import {
  useFonts,
  Raleway_400Regular,
  Raleway_700Bold,
} from "@expo-google-fonts/raleway";
//  Importing library for Icons
import { FontAwesome5 } from "@expo/vector-icons";

//  Showing AboutUs Screen Components
export default function Aboutus({ navigation }) {
  //  Loading fonts
  useFonts({
    Raleway_400Regular,
    Raleway_700Bold,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.team}>Developed by:</Text>
      <Text style={styles.small}>(the wonderful students)</Text>

      <View style={styles.rowDeveloper}>
        <FontAwesome5 name="user-alt" size={20} color="black" />
        <Text style={styles.developer}>Alan Gabriel Arango Monroy</Text>
      </View>
      <View style={styles.rowDeveloper}>
        <FontAwesome5 name="user-alt" size={20} color="black" />
        <Text style={styles.developer}>Christian Jesus Farfan Colin</Text>
      </View>
      <View style={styles.rowDeveloper}>
        <FontAwesome5 name="user-alt" size={20} color="black" />
        <Text style={styles.developer}>Claudia Luiza Gonzalez Ferrufino</Text>
      </View>
      <View style={styles.rowDeveloper}>
        <FontAwesome5 name="user-alt" size={20} color="black" />
        <Text style={styles.developer}>Jackson Ferreira Dos Santos</Text>
      </View>
    </View>
  );
}

//Stylesheet for AboutUs screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#02b2e8",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  team: {
    color: "#ffffff",
    fontFamily: "Raleway_700Bold",
    fontSize: 35,
    marginTop: 40,
  },
  small: {
    fontFamily: "Raleway_400Regular",
    fontSize: 12,
    marginBottom: 30,
  },
  rowDeveloper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    paddingBottom: 15,
  },
  developer: {
    fontFamily: "Raleway_400Regular",
    fontSize: 20,
    paddingLeft: 5,
  },
});
