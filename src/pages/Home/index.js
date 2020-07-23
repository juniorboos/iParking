import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { RectButton } from 'react-native-gesture-handler';
import { db } from '../../services/firebase';

import CustomCallout from '../../components/CustomCallout'

export default function Home({ navigation }) {
   const [initialPosition, setInitialPosition] = useState([0, 0])
   const [parkings, setParkings] = useState([]);
   const [state, setState] = useState();

   useEffect(() => {
      async function loadPosition() {
         try {
            const { status } = await Location.requestPermissionsAsync();

            if (status !== 'granted') {
               Alert.alert('Ooooops...', 'Precisamos de sua permissão para obter a localização');
            return;
            }

            const location = await Location.getCurrentPositionAsync();
            console.log(location.coords)
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
      }

      loadPosition();
      loadParkings();
   }, [])

   // function changeRegion (coordinates) {
   //    const region = {
   //       latitude: coordinates[0],
   //       longitude: coordinates[1],
   //       latitudeDelta: 0.014,
   //       longitudeDelta: 0.014,
   //    }
   //    this.mapView.animateToRegion(region, 1000)
   // }

   // function loadSpots () {
   //    api.post('available', data).then(response => {
   //       const responseBody = JSON.parse(response.data)
   //       console.log(responseBody);
   //    }).then(() => {
   //       // return navigation.navigate('Home');
   //    })
   // }


   return (
      <>
         
         <View style={styles.mapContainer}>
            {initialPosition[0] !== 0 && (
               <MapView
                  // ref = {(ref)=> this.mapView = ref}
                  style={styles.map}
                  minZoomLevel={13}
                  loadingEnabled={true}
                  showsUserLocation={true}
                  initialRegion={{
                     latitude: initialPosition[0],
                     longitude: initialPosition[1],
                     latitudeDelta: 0.014,
                     longitudeDelta: 0.014,
                  }}>
                  {/* <Marker
                     // pinColor="#9D11DF"
                     coordinate={{
                        latitude: initialPosition[0],
                        longitude: initialPosition[1],
                  }}>
                     <View style={styles.radius}>
                        <View style={styles.marker} />
                     </View>
                  </Marker> */}
                  { parkings.map((parking, index) => {
                     return (
                        <Marker
                           // onPress={() => changeRegion(parking.coordinates)}
                           // onPress={() => loadSpots()}
                           key={index}
                           pinColor="#9D11DF"
                           coordinate={{
                              latitude: parking.coordinates[0],
                              longitude: parking.coordinates[1],
                        }} >
                           <Callout>
                              <CustomCallout title={parking.name}/>
                           </Callout>
                        </Marker>
                     )
                  })}
               </MapView>
            )}

         </View>
         <RectButton style={styles.button} onPress={() => navigation.navigate("NewReservation", parkings)}>
            <Text style={styles.buttonText}>
               Make New Reservation
            </Text>
            <View style={styles.buttonIcon}>
               <Text>
                  <Icon name="chevron-right" color="#FFF" size={24} />
               </Text>
            </View>
         </RectButton>
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
   );
}

const styles = StyleSheet.create({

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
   floatingMenu: {
      width: '100%',
      justifyContent: 'center', 
      alignItems: 'center',
      alignSelf: 'center',
      position: 'absolute',
      top: 110 + Constants.statusBarHeight
   },
   container: {
      maxHeight: '20%'
   },
   buttonMenu: {
      height: 0,
      color: 'white',
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

   button: {
      backgroundColor: "#AD00FF",
      height: 60,
      flexDirection: 'row',
      overflow: 'hidden',
      alignItems: 'center',
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
      flex: 1,
      width: '100%',
      borderRadius: 10,
      // overflow: 'hidden',
      justifyContent: 'flex-start'
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