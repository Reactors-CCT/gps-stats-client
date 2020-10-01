import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect} from 'react';
import { Animated, StyleSheet, Text, View, Button, BackHandler } from 'react-native';
import Geolocation from '@react-native-community/geolocation';


export default function FindMe ({ navigation }) {

  const socket = navigation.state.params.socket;
  const [stats, setStats] = useState('');
  const [user, setUser] = useState(socket.id);
  const [countPeople, setCountPeople] = useState(0);  
  const [isLocated, setIsLocated] = useState(true);
  const [userData, setUserData] = useState({
    userSocket: '', 
    latitude: 0, 
    longitude: 0, 
    location: '', 
    country: '',
    county: '',
    locality: '',
    postcode: ''
  });

  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {    
    const interval = setInterval(() => {      
      socket.emit('refresh');
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  
  socket.on('newUser',data=>{  
    setUser(data);  
  });
 
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
      saveData(lat, long, loc, json.results[0].components);
      return socket.emit('sendData',{user,loc});
  }); 
  }

  function saveData(lat, long, loc, data){
    return setUserData({
      userSocket: user, 
      latitude: lat, 
      longitude: long, 
      location: loc, 
      country: data.country,
      county: data.county,
      locality: data.locality,
      postcode: data.postcode
    }); 
  }

  function locateMe(){   
    Geolocation.getCurrentPosition(position =>{
      findLocation(position.coords.latitude,position.coords.longitude); 
    }, error => {
      console.log("couldn't get position");
    }, {enableHighAccuracy: true, timeout: 20000, maximumAge: 2000});  
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000
    }).start();
    setIsLocated(false);    
  } 
  

  return (  
    <View style={styles.container}>
      <Text>Welcome to GPS Sensor App!</Text>
      <Text>User: {user}</Text>
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
        <Text>Country: {userData.country}</Text>
        <Text>County: {userData.county}</Text>
        <Text>District or Town: {userData.location}</Text>
        <Text>Locality: {userData.locality}</Text>
        <Text>Postcode: {userData.postcode}</Text>
      </Animated.View>   
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
      </Animated.View>   
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: '#02b2e8',
    },
    fadingContainer: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: "powderblue"
    },
    fadingText: {
      fontSize: 28,
      textAlign: "center",
      margin: 10
    },
    buttonRow: {
      flexDirection: "row",
      marginVertical: 16
    }
  });