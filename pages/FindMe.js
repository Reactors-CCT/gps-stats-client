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