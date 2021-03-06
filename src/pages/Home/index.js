import React, { useState, useEffect, useRef, useReducer } from "react";
import { Feather as Icon, MaterialIcons, Entypo } from "@expo/vector-icons";
import {
   View,
   Image,
   Text,
   StyleSheet,
   TouchableOpacity,
   ActivityIndicator,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { RectButton } from "react-native-gesture-handler";
import firebase, { db, GeoFirestore } from "../../services/firebase";

import CustomCallout from "../../components/CustomCallout";
import LoadingScreen from "../../components/LoadingScreen";
import ReservationCard from "../../components/ReservationCard";
import Button from "../../components/Button";
import { Animated } from "react-native";

export default function Home({ navigation }) {
   const [initialPosition, setInitialPosition] = useState([0, 0]);
   const [parkings, setParkings] = useState([]);
   const [spots, setSpots] = useState([]);
   const [loadingSpots, setLoadingSpots] = useState(false);
   const [bottom, setBottom] = useState(1);
   const [parkingFocus, setParkingFocus] = useState(null);
   const userId = firebase.auth().currentUser.uid;
   const [checkingSpots, setCheckingSpots] = useState(false);

   useEffect(() => {
      async function loadPosition() {
         try {
            const location = await Location.getCurrentPositionAsync();
            const { latitude, longitude } = location.coords;
            const coordinates = [latitude, longitude];
            loadParkings(coordinates);
         } catch (error) {
            loadPosition();
         }
      }

      async function loadParkings(coordinates) {
         const parkingsList = [];
         const query = GeoFirestore.collection("Parkings").near({
            center: new firebase.firestore.GeoPoint(
               coordinates[0],
               coordinates[1]
            ),
            radius: 10,
         });
         query.get().then((snapshot) => {
            snapshot.forEach((doc) => {
               parkingsList.push({
                  id: doc.id,
                  ...doc.data(),
                  coordinates: [
                     doc.data().g.geopoint.latitude,
                     doc.data().g.geopoint.longitude,
                  ],
               });
            });
            setInitialPosition(coordinates);
            setParkings(parkingsList);
            console.log("Parkings: ");
            console.log(parkingsList);
         });
      }

      loadPosition();
   }, []);

   async function checkSpots(parkingId) {
      setLoadingSpots(true);
      const { data } = await firebase.functions().httpsCallable("searchSpots")({
         parking: parkingId,
      });
      const spotsList = [];
      console.log("Aguardando spots...");
      // setCheckingSpots(true)
      setSpots(spotsList);
      const userRef = firebase
         .database()
         .ref("Users/" + userId)
         .child("SearchSpots");
      userRef.on("child_added", (snapshot) => {
         if (snapshot.val() != null) {
            console.log("Spot found");
            spotsList.push(snapshot.val());
            console.log(snapshot.val());
         }
      });

      setTimeout(() => {
         console.log("Parou de escutar");
         setSpots(spotsList);
         setLoadingSpots(false);
         setCheckingSpots(true);
         userRef.off();
         userRef.remove();
      }, 9000);
   }
   const axisY = useRef(new Animated.Value(0)).current;
   const fadeIn = useRef(new Animated.Value(0)).current;

   function moveFooterDown() {
      Animated.timing(axisY, {
         toValue: 150,
         duration: 500,
         useNativeDriver: true,
      }).start();
   }

   function moveFooterUp() {
      Animated.timing(axisY, {
         toValue: 0,
         duration: 500,
         useNativeDriver: true,
      }).start();
   }

   function fadeCard() {
      Animated.timing(fadeIn, {
         toValue: 1,
         duration: 500,
         useNativeDriver: true,
      }).start();
   }

   return (
      <>
         {initialPosition[0] == 0 ? (
            <LoadingScreen />
         ) : (
            <>
               {/* <View style={parkingFocus != null ? styles.mapContainer : [styles.mapContainer, {height: '75%'}]}> */}
               <View style={styles.mapContainer}>
                  <MapView
                     onPress={() => {
                        setParkingFocus(null),
                           setCheckingSpots(false),
                           moveFooterUp();
                     }}
                     style={styles.map}
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
                     }}
                  >
                     {checkingSpots == true
                        ? spots.map((spot, index) => {
                             return (
                                <Marker
                                   key={index}
                                   onPress={() => console.log(checkingSpots)}
                                   coordinate={{
                                      latitude: spot.coordinates[0],
                                      longitude: spot.coordinates[1],
                                   }}
                                >
                                   <Entypo
                                      name="dot-single"
                                      color="#34CB79"
                                      size={42}
                                   />
                                </Marker>
                             );
                          })
                        : parkings.map((parking, index) => {
                             return (
                                <Marker
                                   key={index}
                                   onPress={() => {
                                      setParkingFocus(parking),
                                         moveFooterDown(),
                                         fadeCard();
                                   }}
                                   coordinate={{
                                      latitude: parking.coordinates[0],
                                      longitude: parking.coordinates[1],
                                   }}
                                >
                                   <MaterialIcons
                                      name="location-on"
                                      color="#AD00FF"
                                      size={42}
                                   />
                                </Marker>
                             );
                          })}
                  </MapView>
               </View>
               {/* <View style={parkingFocus == null ? styles.footer: styles.footer2}> */}
               <Animated.View
                  style={[
                     styles.footer,
                     { transform: [{ translateY: axisY }] },
                  ]}
               >
                  {parkingFocus != null ? (
                     <Animated.View style={[styles.card, { opacity: fadeIn }]}>
                        <View>
                           <Image
                              style={{
                                 height: 100,
                                 resizeMode: "cover",
                                 marginBottom: 6,
                              }}
                              source={{ uri: parkingFocus.image }}
                           />
                           <Text style={styles.name}> {parkingFocus.name}</Text>
                        </View>
                        <TouchableOpacity
                           style={styles.checkSpotsButton}
                           onPress={() => checkSpots(parkingFocus.id)}
                        >
                           {loadingSpots ? (
                              <ActivityIndicator
                                 style={styles.buttonText}
                                 size="large"
                                 color="#FFF"
                              />
                           ) : (
                              <Text style={styles.buttonText}>Check spots</Text>
                           )}
                           <Icon name="chevron-right" color="#FFF" size={24} />
                        </TouchableOpacity>
                     </Animated.View>
                  ) : null}
                  <RectButton
                     style={styles.button}
                     onPress={() =>
                        navigation.navigate("NewReservation", parkings)
                     }
                  >
                     <Text style={styles.buttonText}>Make New Reservation</Text>
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
                              <Icon
                                 name="shopping-cart"
                                 color="#000"
                                 size={24}
                              />
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
                              <Icon
                                 name="chevron-right"
                                 color="#000"
                                 size={24}
                              />
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
                              <Icon
                                 name="chevron-right"
                                 color="#000"
                                 size={24}
                              />
                           </Text>
                        </View>
                     </TouchableOpacity>
                  </View>
               </Animated.View>
               {/* </View> */}

               <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigation.toggleDrawer()}
                  style={styles.TouchableOpacityStyle}
               >
                  <Icon
                     name="menu"
                     color="#AD00FF"
                     size={24}
                     style={styles.FloatingButtonStyle}
                  />
               </TouchableOpacity>
            </>
         )}
      </>
   );
}

const styles = StyleSheet.create({
   footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
   },

   footer2: {
      position: "absolute",
      bottom: -150,
      left: 0,
      right: 0,
   },

   card: {
      marginBottom: 8,
      elevation: 2,
      backgroundColor: "#FFF",
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      marginHorizontal: "5%",
      shadowColor: "#000",
      shadowRadius: 5,
      shadowOpacity: 0.3,
      shadowOffset: { x: 2, y: -2 },
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
      width: "90%",
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
      flexDirection: "column",
      alignSelf: "flex-start",
      backgroundColor: "#FFF",
      borderRadius: 6,
      borderColor: "#CCC",
      borderWidth: 0.5,
      padding: 15,
      width: 150,
   },
   arrow: {
      backgroundColor: "transparent",
      borderColor: "transparent",
      borderTopColor: "#FFF",
      borderWidth: 16,
      alignSelf: "center",
      marginTop: -32,
   },
   arrowBorder: {
      backgroundColor: "transparent",
      borderColor: "transparent",
      borderTopColor: "#007a87",
      borderWidth: 16,
      alignSelf: "center",
      marginTop: -0.5,
   },
   name: {
      fontSize: 18,
      marginBottom: 6,
      textAlign: "center",
   },
   radius: {
      height: 50,
      width: 50,
      borderRadius: 50 / 2,
      overflow: "hidden",
      backgroundColor: "rgba(0, 122, 255, 0.1)",
      borderWidth: 1,
      borderColor: "rgba(0, 112, 255, 0.3)",
      alignItems: "center",
      justifyContent: "center",
   },
   marker: {
      height: 20,
      width: 20,
      borderWidth: 3,
      borderColor: "white",
      borderRadius: 20 / 2,
      overflow: "hidden",
      backgroundColor: "#007AFF",
   },

   FloatingButtonStyle: {
      // resizeMode: 'contain',
      width: 50,
      height: 50,
      backgroundColor: "white",
      borderRadius: 30,
      textAlign: "center",
      textAlignVertical: "center",
   },
   TouchableOpacityStyle: {
      position: "absolute",
      width: 50,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      right: 30,
      top: 30 + Constants.statusBarHeight,
   },
   container: {
      maxHeight: "20%",
   },
   preset: {
      // marginBottom: 4,
      borderBottomWidth: 4,
      borderColor: "#CCC",
      backgroundColor: "#FFF",
      height: 75,
      flexDirection: "row",
      overflow: "hidden",
      alignItems: "center",
      shadowColor: "rgba(0,0,0, .4)", // IOS
      shadowOffset: { height: 1, width: 1 }, // IOS
      shadowOpacity: 1, // IOS
      shadowRadius: 1, //IOS
      elevation: 4, // Android
   },

   presetText: {
      flex: 1,
   },

   presetTitle: {
      justifyContent: "center",
      color: "#323232",
      fontSize: 20,
      fontWeight: "bold",
   },

   presetDescription: {
      justifyContent: "center",
      color: "#323232",
      fontSize: 16,
   },
   checkSpotsButton: {
      backgroundColor: "#FF0077",
      height: 50,
      flexDirection: "row",
      overflow: "hidden",
      alignItems: "center",
      paddingHorizontal: 10,
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
   },

   button: {
      backgroundColor: "#AD00FF",
      height: 60,
      flexDirection: "row",
      overflow: "hidden",
      alignItems: "center",
      // paddingHorizontal: 10,
   },

   buttonIcon: {
      height: 60,
      width: 60,
      // backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: "center",
      alignItems: "center",
   },

   buttonText: {
      flex: 1,
      justifyContent: "center",
      paddingStart: 16,
      color: "#FFF",
      fontSize: 20,
      fontWeight: "bold",
   },

   description: {
      color: "#6C6C80",
      fontSize: 16,
      marginTop: 4,
   },

   mapContainer: {
      // flex: 1,
      width: "100%",
      height: "100%",
      // borderRadius: 10,
      // borderWidth: 10,
      justifyContent: "flex-start",
      position: "relative",
   },

   map: {
      width: "100%",
      height: "100%",
   },

   mapMarker: {
      width: 90,
      height: 80,
   },

   mapMarkerContainer: {
      width: 90,
      height: 70,
      backgroundColor: "#34CB79",
      flexDirection: "column",
      borderRadius: 8,
      overflow: "hidden",
      alignItems: "center",
   },

   mapMarkerImage: {
      width: 90,
      height: 45,
      resizeMode: "cover",
   },

   mapMarkerTitle: {
      flex: 1,
      color: "#FFF",
      fontSize: 13,
      lineHeight: 23,
   },

   itemsContainer: {
      flexDirection: "row",
      marginTop: 16,
      marginBottom: 32,
   },

   item: {
      backgroundColor: "#fff",
      borderWidth: 2,
      borderColor: "#eee",
      height: 120,
      width: 120,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
      marginRight: 8,
      alignItems: "center",
      justifyContent: "space-between",

      textAlign: "center",
   },

   selectedItem: {
      borderColor: "#34CB79",
      borderWidth: 2,
   },

   itemTitle: {
      textAlign: "center",
      fontSize: 13,
   },
});
