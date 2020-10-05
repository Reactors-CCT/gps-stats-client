import React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';

//importing socket.io-client and connecting to the server
import io from 'socket.io-client';
var dev = false;
var hostname = dev?  'http://localhost:3000' : 'https://gps-stats-server.herokuapp.com';
console.log("Connecting to " + hostname);
const socket = io.connect(hostname);

//showing Home Screen Components
export default function Home({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.team}>Reactors</Text>
            <Image style={styles.logo} source={require('../assets/logo.png')} />
            
            <Button color="grey" variant="contained"
                onPress={() =>{
                    navigation.navigate('FindMe',{socket})
                }}
                title='Find me'
                />
                <View style={styles.padd}>
                <Button color="grey" variant="contained"
                    onPress={() => {
                        navigation.navigate('AboutUs')
                    }}
                    title='About Us'
                />
            </View>
        </View>
);
}

//Stylesheet for Home
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#02b2e8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 200,
        height: 150,
    },
    team: {
        color: '#ffffff',
        fontFamily: "notoserif",
        fontSize: 40,
        fontWeight: "bold"

    },
    padd: {
        marginTop: 10,
        paddingTop: 10

    },

});