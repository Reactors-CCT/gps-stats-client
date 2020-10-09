import { StatusBar } from "expo-status-bar";
import React, { useState, useRef, useEffect } from "react";
import { Animated, StyleSheet, Text, View, Button } from "react-native";
//  Importing Google Fonts
import {
  useFonts,
  Raleway_400Regular,
  Raleway_600SemiBold,
  Raleway_700Bold,
} from "@expo-google-fonts/raleway";
//  Importing library for Icons
import { FontAwesome5 } from "@expo/vector-icons";
//  Importing Geolocation library
import Geolocation from "@react-native-community/geolocation";

export default function FindMe({ navigation }) {
  //  Recovers socket id from Home screen
  const socket = navigation.state.params.socket;
  // Stores statistics
  const [stats, setStats] = useState("");
  // Stores user's socket
  const [user, setUser] = useState(socket.id);
  //  Stores the currect active sockets
  const [countPeople, setCountPeople] = useState(0);
  //  Used to enable or disable button
  const [isLocated, setIsLocated] = useState(true);
  //  Stores user's data
  const [userData, setUserData] = useState({
    userSocket: "",
    latitude: 0,
    longitude: 0,
    location: "",
    country: "",
    county: "",
    postcode: "",
  });

  //  Used for the animated boxes style
  const fadeAnim = useRef(new Animated.Value(0)).current;
  //  Loading fonts
  useFonts({
    Raleway_400Regular,
    Raleway_600SemiBold,
    Raleway_700Bold,
  });

  //  Creates an interval where refreshes the statistics every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      socket.emit("refresh");
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  //  Stores user's socket for every connection
  socket.on("newUser", (data) => {
    setUser(data);
  });

  //  Refreshes the stats with the data recovered from the server
  socket.on("newStats", (data) => {
    let textStats = "";
    let counter = 0;
    for (var i = 0; i < data.length; i++) {
      textStats += data[i].location + ": " + data[i].counter + "\n";
      counter += data[i].counter;
    }
    setCountPeople(counter);
    setStats(textStats);
  });

  //  Open cage function to retrieve data using the latitude and longitude
  let findLocation = (lat, long) => {
    let url =
      "https://api.opencagedata.com/geocode/v1/json?key=44a9f29b61514c1bb30d4781d418d6f3&q=" +
      lat +
      "+" +
      long;
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        let loc = "Other";
        if ("district" in json.results[0].components) {
          loc = json.results[0].components.district;
        } else if ("town" in json.results[0].components) {
          loc = json.results[0].components.town;
        }
        //  Calls function to save data
        saveData(lat, long, loc, json.results[0].components);
        //  Emitting event to send data to the server
        return socket.emit("sendData", { user, loc });
      });
  };

  //  Function to store data recovered from opencage into a variable
  function saveData(lat, long, loc, data) {
    return setUserData({
      userSocket: user,
      latitude: lat,
      longitude: long,
      location: loc,
      country: data.country,
      county: data.county,
      postcode: data.postcode,
    });
  }

  //  Main function called when the button is pressed
  function locateMe() {
    //  Gets the position of the user
    Geolocation.getCurrentPosition(
      (position) => {
        //  Calling opencage function using the coords achieved
        findLocation(position.coords.latitude, position.coords.longitude);
      },
      //  Calling error function
      (err) => { 
        errorMessage(err);
      },
      //  Enabling accuracy option, setting time options
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000 }
    );
    //  Starts animation to present the text and statistics
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
    }).start();

    //  Disables button
    setIsLocated(false);
  }

  //  Function called in case of error
  function errorMessage(err){
    navigation.navigate("ErrorPage", {err});
  }

  //  Displays components
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to FindMe App!</Text>

      <View style={styles.rowUser}>
        <FontAwesome5 name="user-alt" size={25} color="black" />
        <Text style={styles.user}>{user}</Text>
      </View>
      <View style={{ width: "45%" }}>
        <Button onPress={locateMe} title="Where am I?" disabled={!isLocated} />
      </View>
      <Animated.View
        style={[
          styles.fadingContainer,
          {
            opacity: fadeAnim, // Bind opacity to animated value
          }
        ]}
      >
        <Text style={styles.subtitle}>LOCATION </Text>
        <View style={styles.list}>
          <Text style={styles.listRowHeader}>Latitude:</Text>
          <Text style={styles.listRow}>{userData.latitude.toFixed(7)}</Text>
        </View>
        <View style={styles.list}>
          <Text style={styles.listRowHeader}>Longitude:</Text>
          <Text style={styles.listRow}>{userData.longitude.toFixed(7)}</Text>
        </View>
      </Animated.View>
      <Animated.View
        style={[
          styles.fadingContainer,
          {
            opacity: fadeAnim, // Bind opacity to animated value
          }
        ]}
      >
        <Text style={styles.subtitle}>DETAILS </Text>
        <View style={styles.list}>
          <Text style={styles.listRowHeader}>Country:</Text>
          <Text style={styles.listRow}>{userData.country}</Text>
        </View>
        <View style={styles.list}>
          <Text style={styles.listRowHeader}>County:</Text>
          <Text style={styles.listRow}>{userData.county}</Text>
        </View>
        <View style={styles.list}>
          <Text style={styles.listRowHeader}>District/Town:</Text>
          <Text style={styles.listRow}>{userData.location}</Text>
        </View>
        <View style={styles.list}>
          <Text style={styles.listRowHeader}>Postcode:</Text>
          <Text style={styles.listRow}>{userData.postcode}</Text>
        </View>
      </Animated.View>
      <Animated.View
        style={[
          styles.fadingContainer,
          {
            opacity: fadeAnim, // Bind opacity to animated value
          }
        ]}
      >
        <Text style={styles.subtitle}>STATISTICS </Text>
        <View style={styles.list}>
          <Text>Currently {countPeople} user(s) online</Text>
        </View>
        <Text style={styles.subtitle2}>User Locations</Text>
        <View style={styles.list}>
          <Text>{stats}</Text>
        </View>
      </Animated.View>
      <Animated.View
        style={[
          styles.fadingContainerAboutUs,
          {
            opacity: fadeAnim, // Bind opacity to animated value
          }
        ]}
      >
        <Button
          color="grey"
          variant="contained"
          onPress={() => {
            navigation.navigate("AboutUs");
          }}
          title="ABOUT US"
        />
      </Animated.View>
    </View>
  );
}

//  Stylesheet for FindMe Screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#02b2e8",
  },
  title: {
    color: "#ffffff",
    fontFamily: "Raleway_700Bold",
    fontSize: 25,
    fontWeight: "bold",
    paddingTop: 45,
    paddingBottom: 15,
  },
  subtitle: {
    color: "grey",
    fontFamily: "Raleway_600SemiBold",
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle2: {
    color: "grey",
    fontFamily: "Raleway_600SemiBold",
    fontSize: 15,
    fontWeight: "bold",
  },
  rowUser: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "60%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  user: {
    fontFamily: "Raleway_600SemiBold",
    fontSize: 15,
    fontWeight: "bold",
    paddingTop: 20,
    paddingBottom: 25,
  },
  fadingContainer: {
    width: "70%",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "powderblue",
    marginTop: 20,
    fontFamily: "Raleway_400Regular",
    fontSize: 15,
  },
  fadingContainerAboutUs: {
    width: "50%",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 20,
    fontFamily: "Raleway_400Regular",
    fontSize: 15,
  },
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderTopWidth: "thin",
    borderTopColor: "grey",
    paddingBottom: 5,
  },
  listRowHeader: {
    flex: 1,
    color: "grey",
  },
  listRow: {
    flex: 1,
  }
});
