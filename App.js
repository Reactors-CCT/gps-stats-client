import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Group } from 'react-native';
import io from 'socket.io-client';
import Geolocation from '@react-native-community/geolocation';
import { render } from 'react-dom';

var dev = true;
var hostname = dev?  'http://localhost:3000' : 'https://gps-stats-server.herokuapp.com';

console.log("Connecting to " + hostname);

const socket = io.connect(hostname);

export default function App() {
  const [user, setUser] = useState('');
  const [userData, setUserData] = useState({userSocket: '', latitude: 0, longitude: 0, location: ''});
  const [stats, setStats] = useState([]);  
  const [timer, setTimer] = useState(0);
  const [userLocation, setUserLocation] = useState('');

    /*useEffect(()=>{
        setTimeout(()=>{
            setTimer(timer+1);
            //socket.emit('refresh');
        },1000);
    }, [timer]);*/
  
  socket.on('newUser',data=>{  
    setUser(data);   
  });
 
  socket.on('newStats',data=>{  
    for(var i=0; i<data.length;i++){
      setStats([...stats, {location: data[i].location, counter: data[i].counter}]);
    }
    //console.log(stats);
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
        setUserLocation(loc);
        setUserData({userSocket: user, latitude: lat, longitude: long, location: loc}); 
      } else if ('town' in json.results[0].components){
        loc = json.results[0].components.town;
        setUserLocation(loc);
        setUserData({userSocket: user, latitude: lat, longitude: long, location: loc});           
      } else {
        setUserLocation(loc);
        setUserData({userSocket: user, latitude: lat, longitude: long, location: loc});  
      }
      //const {latitude, longitude, location} = user;
      //console.log({latitude, longitude, location});
      //return socket.emit('position',{latitude,longitude,location}); 
      return socket.emit('sendData',{user,loc});
  }); 
  }


  function locateMe(){   
    Geolocation.getCurrentPosition(position =>{
      findLocation(position.coords.latitude,position.coords.longitude); 
    }, error => {
      console.log("couldn't get position");
    }, {enableHighAccuracy: true, timeout: 20000, maximumAge: 2000});  
  } 
  
  /* need to erase previous list and put the new one */
  return (  
    <View style={styles.container}>
      <Text>Welcome to GPS Sensor App!</Text>
      <Text>User: {user}</Text>
      <Button onPress={locateMe} title="Locate Me"/>   
      <Text>{userData.latitude}</Text>
      <Text>{userData.longitude}</Text>
      <Text>{userData.location}</Text>
      
      <div>
        <ul>
          {stats.map(({location, counter},  index) =>(
                <li key={index}>{location}:{counter}</li>
          ))}          
        </ul>
      </div>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
