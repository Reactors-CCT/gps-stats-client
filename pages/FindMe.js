import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect} from 'react';
import { Animated, StyleSheet, Text, View, Button } from 'react-native';

//importing geolocation
import Geolocation from '@react-native-community/geolocation';

export default function FindMe ({ navigation }) {
  
  //recovers socket id from Home screen
  const socket = navigation.state.params.socket;
  //stores statistics
  const [stats, setStats] = useState('');
  //stores user's socket
  const [user, setUser] = useState(socket.id);
  //stores the currect active sockets
  const [countPeople, setCountPeople] = useState(0);  
  //used to enable or disable button
  const [isLocated, setIsLocated] = useState(true);
  //stores user's data
  const [userData, setUserData] = useState({
    userSocket: '', 
    latitude: 0, 
    longitude: 0, 
    location: '', 
    country: '',
    county: '',
    postcode: ''
  });

  //used for the animated boxes style
  const fadeAnim = useRef(new Animated.Value(0)).current;

  //creates an interval where refreshes the statistics every 1 second
  useEffect(() => {    
    const interval = setInterval(() => {      
      socket.emit('refresh');
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  
  //stores user's socket for every connection
  socket.on('newUser',data=>{  
    setUser(data);  
  });
 
  //refreshes the stats with the data recovered from the server
  socket.on('newStats',data=>{ 
    let textStats = '';
    let counter = 0;
    for(var i=0; i<data.length;i++){     
      textStats += data[i].location + ': ' + data[i].counter + '\n'
      counter += data[i].counter;
    }
    setCountPeople(counter);
    setStats(textStats);    
  }); 

  //open cage function to retrieve data using the latitude and longitude 
  let findLocation= (lat, long) =>{
  let url = 'https://api.opencagedata.com/geocode/v1/json?key=44a9f29b61514c1bb30d4781d418d6f3&q=' + lat + '+' + long;
    fetch(url) 
    .then((response) => {
      return response.json()
    })    
    .then((json) => {
      let loc = "Other";
      if('district' in json.results[0].components){         
        loc = json.results[0].components.district;        
      } else if ('town' in json.results[0].components){
        loc = json.results[0].components.town;                  
      }
      //calls function to save data
      saveData(lat, long, loc, json.results[0].components);
      //emitting event to send data to the server
      return socket.emit('sendData',{user,loc});
  }); 
  }

  //function to store data recovered from opencage into a variable
  function saveData(lat, long, loc, data){
    return setUserData({
      userSocket: user, 
      latitude: lat, 
      longitude: long, 
      location: loc, 
      country: data.country,
      county: data.county,
      postcode: data.postcode
    }); 
  }

  //main function called when the button is pressed
  function locateMe(){   
    //gets the position of the user
    Geolocation.getCurrentPosition(position =>{
      //calling opencage function using that position
      findLocation(position.coords.latitude,position.coords.longitude); 
    }, error => {
      console.log("couldn't get position");
    }, {enableHighAccuracy: true, timeout: 20000, maximumAge: 2000}); 
    //starts animation to present the text and statistics
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000
    }).start();
    //disables button
    setIsLocated(false);    
  } 
  
  //displays components
  return (  
    <View style={styles.header}>
      <Text style={styles.title}>Welcome to GPS Sensor App!</Text>
      <Text>User: {user}</Text>
      <View style={styles.container}>      
        <Animated.View
          style={[
            styles.fadingContainer,
            {
              opacity: fadeAnim // Bind opacity to animated value
            }
          ]}
        >
          <Text>Statistics: </Text>
          <Text>Currently {countPeople} users online</Text>
          <Text>User Locations:</Text>
          <Text>{stats}</Text>
          <StatusBar style="auto" />
        </Animated.View>
        <Button onPress={locateMe} title="Where am I?" disabled={!isLocated}/> 
        <Animated.View
        style={[
          styles.fadingContainer,
          {
            opacity: fadeAnim // Bind opacity to animated value
          }
        ]}
      >
          <Text>Latitude: {userData.latitude}</Text>
          <Text>Longitude: {userData.longitude}</Text>
        </Animated.View>
        <View style={styles.paralel}>
          <Animated.View
              style={[
                styles.fadingContainer2,
                {
                  opacity: fadeAnim // Bind opacity to animated value
                }
              ]}
            >
          <Text>Country:</Text>
          <Text>County:</Text>
          <Text>District/Town:</Text>
          <Text>Postcode:</Text>
        </Animated.View>  
        <Animated.View
            style={[
              styles.fadingContainer2,
              {
                opacity: fadeAnim // Bind opacity to animated value
              }
            ]}
          >
            <Text>{userData.country}</Text>
            <Text>{userData.county}</Text>
            <Text>{userData.location}</Text>
            <Text>{userData.postcode}</Text>      
          </Animated.View>  
        </View>
      </View>
    </View>
  );
}

//Stylesheet for FindMe Screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: '#02b2e8',
  },
  header: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#02b2e8',
  },
  title: {
    color: '#ffffff',
    fontFamily: "notoserif",
    fontSize: 25,
    fontWeight: "bold",
    paddingTop: 45,
    paddingBottom: 15
  },
  fadingContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "powderblue",
    marginTop: 20
  },
  fadingContainer1: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "powderblue",
    marginBottom: 20,
    marginTop: 20
  },
  fadingContainer2: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "powderblue",
    marginRight: 10,
    marginTop: 10
  },
  fadingText: {
    fontSize: 28,
    textAlign: "center",
    margin: 10
  },
  buttonRow: {
    flexDirection: "row",
    marginVertical: 16
  },
  paralel: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});