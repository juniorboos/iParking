import React, { useState, useEffect } from 'react';
import { Feather as Icon, MaterialIcons } from '@expo/vector-icons';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { RectButton } from 'react-native-gesture-handler';
import firebase, { db } from '../../services/firebase';

import CustomCallout from '../../components/CustomCallout'
import LoadingScreen from '../../components/LoadingScreen'
import ReservationCard from '../../components/ReservationCard'
import Button from '../../components/Button';
import { Animated } from 'react-native';


export default function Home({ navigation }) {
   const [initialPosition, setInitialPosition] = useState([0, 0])
   const [parkings, setParkings] = useState([])
   const [spots, setSpots] = useState([])
   const [bottom, setBottom] = useState(1)
   const [parkingFocus, setParkingFocus] = useState(null)
   const userId = firebase.auth().currentUser.uid;
   const [checkingSpots, setCheckingSpots] = useState(false)

   useEffect(() => {
      async function loadPosition() {
         try {
            const { status } = await Location.requestPermissionsAsync();

            if (status !== 'granted') {
               Alert.alert('Ooooops...', 'Precisamos de sua permissão para obter a localização');
            return;
            }

            const location = await Location.getCurrentPositionAsync();
            const { latitude, longitude } = location.coords;

            setInitialPosition([
               latitude,
               longitude
            ])
            
         } catch (error) {
            loadPosition();
         }
      }

      async function loadParkings () {
         const parkingsList = [];
         const snapshot = await db.collection('Parkings').get();
         snapshot.forEach(doc => {
            parkingsList.push({id: doc.id, ...doc.data()})
         })
         setParkings(parkingsList)
         console.log("Parkings: ")
         console.log(parkingsList)
      }
      loadParkings();
      loadPosition();
   }, [])


   async function checkSpots (parkingId) {
      const { data } = await firebase.functions().httpsCallable('searchSpots')({
         parking: parkingId
      })
      const spotsList = [
         {
            parking:"IPB",
            driverId:"1UgX8NkcA7foU4GJdQZmtN5ez5x1",
            coordinates:[41.799392,-6.768929],
            spotId:"001"
         },
         {
            parking:"IPB",
            driverId:"1UgX8NkcA7foU4GJdQZmtN5ez5x1",
            coordinates:[41.796452,-6.767786],
            spotId:"002"
         },
         {
            parking:"IPB",
            driverId:"1UgX8NkcA7foU4GJdQZmtN5ez5x1",
            coordinates:[41.797770, -6.767289],
            spotId:"003"
         },
         {
            parking:"IPB",
            driverId:"1UgX8NkcA7foU4GJdQZmtN5ez5x1",
            coordinates:[41.798982, -6.765439],
            spotId:"004"
         }
      ]
      console.log("Aguardando spots...")
      setCheckingSpots(true)
      setSpots(spotsList)
      // const userRef = firebase.database().ref('Users/' + userId).child('SearchSpots')
      // userRef.on('child_added', snapshot => {
      //    if(snapshot.val() != null) {
      //       console.log("Spot found")
      //       spotsList.push(snapshot.val())
      //       console.log(snapshot.val())
      //    }
      // })

      // setTimeout(() => {
      //    console.log("Parou de escutar")
      //    setCheckingSpots(true)
      //    setSpots(spotsList)
      //    userRef.off()
      //    userRef.remove()
      // }, 15000)

   }
   
   return (
      <> 
      {initialPosition[0] == 0 ? (
         <LoadingScreen />
      ):(
         <>
         <View style={parkingFocus != null ? styles.mapContainer : [styles.mapContainer, {height: '75%'}]}>
            <MapView
               // ref = {(ref)=> this.mapView = ref}
               onPress={() => {setParkingFocus(null), setCheckingSpots(false)}}
               style={styles.map }
               minZoomLevel={13}
               loadingEnabled={true}
               showsMyLocationButton={false}
               showsUserLocation={true}
               toolbarEnabled={false}
               initialRegion={{
                  latitude: initialPosition[0],
                  longitude: initialPosition[1],
                  latitudeDelta: 0.014,
                  longitudeDelta: 0.014,
               }}>

               {  checkingSpots == true ?
                     spots.map((spot, index) => {
                     return (
                        <Marker
                           key={index}
                           onPress={() => console.log(checkingSpots)}
                           coordinate={{
                              latitude: spot.coordinates[0],
                              longitude: spot.coordinates[1],
                           }} 
                        >
                           <MaterialIcons name="location-on" color="#34CB79" size={42} />
                        </Marker>
                     )})
                  :
                     parkings.map((parking, index) => {
                     return (
                        <Marker
                           key={index}
                           onPress={() => setParkingFocus(parking)}
                           coordinate={{
                              latitude: parking.coordinates[0],
                              longitude: parking.coordinates[1],
                           }}
                        >
                           <MaterialIcons name="location-on" color="#9D11DF" size={42} />
                        </Marker>
                     )})
               }
            </MapView>
               {parkingFocus != null ?
                  <View style={styles.card}>
                     <View >
                        <Image 
                           style = {{height: 100, resizeMode: 'cover', marginBottom: 6 }} 
                           source={{uri:parkingFocus.image}}
                        />
                        <Text style={styles.name} > {parkingFocus.name}</Text>
                     </View>
                     <TouchableOpacity 
                        style={styles.checkSpotsButton} 
                        onPress={() => checkSpots(parkingFocus.id)}>
                        <Text style={styles.buttonText}>
                           Check spots
                        </Text>
                        <Icon name="chevron-right" color="#FFF" size={24} />
                     </TouchableOpacity>
                  </View>
               : null}
         </View>
         <RectButton style={parkingFocus != null ? styles.button : [styles.button, {height: 60}]} onPress={() => navigation.navigate("NewReservation", parkings)}>
            <Text style={styles.buttonText}>
               Make New Reservation
            </Text>
            <View style={styles.buttonIcon}>
               <Text>
                  <Icon name="chevron-right" color="#FFF" size={24} />
               </Text>
            </View>
         </RectButton>
         {parkingFocus == null ?
         <View style={styles.container}>
            <TouchableOpacity style={styles.preset}>
               <View style={styles.buttonIcon}>
                  <Text>
                     <Icon name="shopping-cart" color="#000" size={24} />
                  </Text>
               </View>
               <View style={styles.presetText}>
                  <Text style={styles.presetTitle}>
                     Continente Supermarket
                  </Text>
                  <Text style={styles.presetDescription}>
                     Bragança
                  </Text>
               </View>
               <View style={styles.buttonIcon}>
                  <Text>
                     <Icon name="chevron-right" color="#000" size={24} />
                  </Text>
               </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.preset}>
               <View style={styles.buttonIcon}>
                  <Text>
                     <Icon name="book" color="#000" size={24} />
                  </Text>
               </View>
               <View style={styles.presetText}>
                  <Text style={styles.presetTitle}>
                     Polytechnic Institute of ...
                  </Text>
                  <Text style={styles.presetDescription}>
                     Bragança
                  </Text>
               </View>
               <View style={styles.buttonIcon}>
                  <Text>
                     <Icon name="chevron-right" color="#000" size={24} />
                  </Text>
               </View>
            </TouchableOpacity>
         </View> 
         : null }
         <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.toggleDrawer()}
          style={styles.TouchableOpacityStyle}>
            <Icon 
               name="menu" 
               color="#AD00FF" 
               size={24}
               style={styles.FloatingButtonStyle} />
         </TouchableOpacity>
         </>
      )}
      </>
   );
}

const styles = StyleSheet.create({
   card: {
      position: "absolute",
      bottom: 30,
      left: 0,
      right: 0,
      elevation: 2,
      backgroundColor: "#FFF",
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      marginHorizontal: '5%',
      shadowColor: "#000",
      shadowRadius: 5,
      shadowOpacity: 0.3,
      shadowOffset: { x: 2, y: -2 },
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
      width: '90%',
      overflow: "hidden",
    },
   scrollView: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingVertical: 10,
    },
   bubble: {
      flexDirection: 'column',
      alignSelf: 'flex-start',
      backgroundColor: '#FFF',
      borderRadius: 6,
      borderColor: '#CCC',
      borderWidth: 0.5,
      padding: 15,
      width: 150
   },
   arrow: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderTopColor: '#FFF',
      borderWidth: 16,
      alignSelf: 'center',
      marginTop: -32,
   },
   arrowBorder: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderTopColor: '#007a87',
      borderWidth: 16,
      alignSelf: 'center',
      marginTop: -0.5
   },
   name: {
      fontSize: 18,
      marginBottom: 6,
      textAlign: 'center'
   },
   radius: {
      height: 50,
      width: 50,
      borderRadius: 50 / 2,
      overflow: 'hidden',
      backgroundColor: 'rgba(0, 122, 255, 0.1)',
      borderWidth:1,
      borderColor: 'rgba(0, 112, 255, 0.3)',
      alignItems: 'center',
      justifyContent: 'center' 
   },
   marker: {
      height: 20,
      width: 20,
      borderWidth: 3,
      borderColor: 'white',
      borderRadius: 20 / 2,
      overflow: 'hidden',
      backgroundColor: '#007AFF'
   },

   FloatingButtonStyle: {
      // resizeMode: 'contain',
      width: 50,
      height: 50,
      backgroundColor:'white',
      borderRadius: 30,
      textAlign: 'center',
      textAlignVertical: 'center'
    },
   TouchableOpacityStyle: {
      position: 'absolute',
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      right: 30,
      top: 30 + Constants.statusBarHeight,
      
    },
   container: {
      maxHeight: '20%'
   },
   preset: {
      marginBottom: 4,
      backgroundColor: "#FFF",
      height: 75,
      flexDirection: 'row',
      overflow: 'hidden',
      alignItems: 'center',
      shadowColor: 'rgba(0,0,0, .4)', // IOS
      shadowOffset: { height: 1, width: 1 }, // IOS
      shadowOpacity: 1, // IOS
      shadowRadius: 1, //IOS
      elevation: 4, // Android
   },

   presetText: {
      flex: 1,
   },

   presetTitle: {
      justifyContent: 'center',
      color: '#323232',
      fontSize: 20,
      fontWeight: 'bold'
   },

   presetDescription: {
      justifyContent: 'center',
      color: '#323232',
      fontSize: 16,
   },
   checkSpotsButton: {
      backgroundColor: "#FF0077",
      height: 50,
      flexDirection: 'row',
      overflow: 'hidden',
      alignItems: 'center',
      paddingHorizontal: 10,
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
   },

   button: {
      backgroundColor: "#AD00FF",
      height: '8%',
      flexDirection: 'row',
      overflow: 'hidden',
      alignItems: 'center',
      paddingHorizontal: 10,
   },

   buttonIcon: {
      height: 60,
      width: 60,
      // backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
   },

   buttonText: {
      flex: 1,
      justifyContent: 'center',
      paddingStart: 16,
      color: '#FFF',
      fontSize: 20,
      fontWeight: 'bold'
   },

   description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 4,
   },

   mapContainer: {
      // flex: 1,
      width: '100%',
      height: '92%',
      // borderRadius: 10,
      // borderWidth: 10,
      justifyContent: 'flex-start',
      position: 'relative',
   },

   map: {
      width: '100%',
      height: '100%',
   },

   mapMarker: {
      width: 90,
      height: 80,
   },

   mapMarkerContainer: {
      width: 90,
      height: 70,
      backgroundColor: '#34CB79',
      flexDirection: 'column',
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center'
   },

   mapMarkerImage: {
      width: 90,
      height: 45,
      resizeMode: 'cover',
   },

   mapMarkerTitle: {
      flex: 1,
      color: '#FFF',
      fontSize: 13,
      lineHeight: 23,
   },

   itemsContainer: {
      flexDirection: 'row',
      marginTop: 16,
      marginBottom: 32,
   },

   item: {
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#eee',
      height: 120,
      width: 120,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'space-between',

      textAlign: 'center',
   },

   selectedItem: {
      borderColor: '#34CB79',
      borderWidth: 2,
   },

   itemTitle: {
      textAlign: 'center',
      fontSize: 13,
   },
});