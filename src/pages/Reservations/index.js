import React, { useState, useEffect, useCallback } from "react";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import {
   View,
   StyleSheet,
   Text,
   TouchableOpacity,
   RefreshControl,
   ScrollView,
   Linking,
   Platform,
   ActivityIndicator,
} from "react-native";
import firebase, { db } from "../../services/firebase.js";
import Accordion from "react-native-collapsible/Accordion";
// import openMap from 'react-native-open-maps';
import LoadingScreen from "../../components/LoadingScreen";

export default function Reservations({ navigation }) {
   const [reservations, setReservations] = useState(null);
   const [refreshing, setRefreshing] = useState(false);
   const [activeSections, setActiveSections] = useState([]);
   const [currentReservation, setCurrentReservation] = useState();
   const [loadingState, setLoadingState] = useState(false);
   const userId = firebase.auth().currentUser.uid;

   async function loadReservations() {
      console.log("carregando...");
      const actualDate = new Date();
      const reservationsList = [];
      const snapshot = await db
         .collection("Users")
         .doc(userId)
         .collection("Requests")
         .where("status", "==", "Accepted")
         .get();
      snapshot.forEach((doc) => {
         const timeFrom = doc.data().timeFrom.toDate();
         const timeTo = doc.data().timeTo.toDate();
         const timeFromDisplay =
            timeFrom.toTimeString().split(":")[0] +
            ":" +
            timeFrom.toTimeString().split(":")[1];
         const timeToDisplay =
            timeTo.toTimeString().split(":")[0] +
            ":" +
            timeTo.toTimeString().split(":")[1];
         reservationsList.push({
            id: doc.id,
            ...doc.data(),
            timeFromDisplay: timeFromDisplay,
            timeToDisplay: timeToDisplay,
         });
         if (actualDate > timeFrom && actualDate < timeTo) {
            setCurrentReservation(doc.id);
         }
      });
      reservationsList.sort(function (a, b) {
         return a.timeFrom.toDate() - b.timeFrom.toDate();
      });

      console.log("Current reservation: ", currentReservation);

      setReservations(reservationsList);

      console.log("Reservations: ");
      console.log(reservationsList);
   }

   useEffect(() => {
      loadReservations();
   }, []);

   const onRefresh = useCallback(() => {
      setRefreshing(true);
      loadReservations().then(() => {
         setRefreshing(false);
      });
   }, []);

   async function changeSpotState(reservation) {
      setLoadingState(true);
      console.log(loadingState);
      const reqRef = db
         .collection("Users")
         .doc(userId)
         .collection("Requests")
         .doc(reservation.id);
      // console.log(reservation.id)
      if (reservation.userStatus == false) {
         console.log("Entrando...");
         reqRef
            .update({
               userStatus: true,
            })
            .then(() => {
               loadReservations().then(() => {
                  setLoadingState(false);
               });
            });
      } else {
         console.log("Saindo...");
         reqRef
            .update({
               userStatus: false,
            })
            .then(() => {
               loadReservations().then(() => {
                  setLoadingState(false);
               });
            });
      }
   }

   async function goToMaps(request) {
      console.log("go to parking: ", request.parking);
      const ref = db.collection("Parkings").doc(request.parking);
      const doc = await ref.get();

      const scheme = Platform.select({
         ios: "maps:0,0?q=",
         android: "geo:0,0?q=",
      });
      const latLng = `${doc.data().coordinates[0]},${
         doc.data().coordinates[1]
      }`;
      const label = "Custom Label";
      const url = Platform.select({
         ios: `${scheme}${label}@${latLng}`,
         android: `${scheme}${latLng}(${label})`,
      });

      Linking.openURL(url);
   }

   const _renderSectionTitle = (section) => {
      return <View style={styles.content}></View>;
   };

   const _renderHeader = (section) => {
      return (
         <View
            style={{
               backgroundColor: "#FFF",
               marginTop: 8,
               borderBottomWidth: 0.2,
               borderColor: "#FFF",
            }}
         >
            <View style={styles.containerAbove}>
               <View style={styles.infoContainer}>
                  <View style={styles.nameInfo}>
                     <Text style={styles.nameText}>{section.parkingName}</Text>
                  </View>
                  <View style={styles.dateContainer}>
                     <View>
                        <Text>{section.date}</Text>
                     </View>
                     <View>
                        <Text>
                           {section.timeFromDisplay} - {section.timeToDisplay}
                        </Text>
                     </View>
                  </View>
               </View>
               <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => goToMaps(section)}
               >
                  <MaterialIcons
                     name="location-on"
                     color={
                        currentReservation == section.id ? "#AD00FF" : "#000"
                     }
                     size={32}
                  />
               </TouchableOpacity>
            </View>
         </View>
      );
   };

   const _renderContent = (section) => {
      return (
         <View style={styles.content}>
            <Text style={styles.detailsText}>
               {section.regionName} - Spot {section.spotWon}
            </Text>
            <Text style={styles.detailsText}>{section.vehicleModel}</Text>
            <Text style={styles.detailsText}>€ {section.priceWon}</Text>
         </View>
      );
   };

   const _renderFooter = (section, content, isActive) => {
      return (
         <View>
            <View style={isActive ? styles.footerActive : styles.footer}>
               {isActive ? (
                  <MaterialIcons
                     name="keyboard-arrow-up"
                     size={28}
                     color="#AD00FF"
                  />
               ) : (
                  <MaterialIcons
                     name="keyboard-arrow-down"
                     size={28}
                     color="#AD00FF"
                  />
               )}
            </View>
            {currentReservation == section.id ? (
               section.userStatus == false ? (
                  <TouchableOpacity
                     style={styles.buttonEnter}
                     onPress={() => changeSpotState(section)}
                  >
                     {loadingState == true ? (
                        <ActivityIndicator size="large" color="#FFF" />
                     ) : (
                        <Text style={styles.buttonText}>Enter spot</Text>
                     )}
                  </TouchableOpacity>
               ) : (
                  <TouchableOpacity
                     style={styles.buttonLeave}
                     onPress={() => changeSpotState(section)}
                  >
                     {loadingState == true ? (
                        <ActivityIndicator size="large" color="#FFF" />
                     ) : (
                        <Text style={styles.buttonText}>Leave spot</Text>
                     )}
                  </TouchableOpacity>
               )
            ) : null}
         </View>
      );
   };

   const _updateSections = (activeSections) => {
      setActiveSections(activeSections);
      // console.log(activeSections)
   };

   return (
      <>
         {reservations == null ? (
            <LoadingScreen />
         ) : (
            <View style={styles.container}>
               <View style={styles.header}>
                  <View style={styles.side}>
                     <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Feather
                           name="chevron-left"
                           size={24}
                           color="#AD00FF"
                        />
                     </TouchableOpacity>
                  </View>
                  <View style={styles.center}>
                     <Text style={styles.profileName}>Reservations</Text>
                  </View>
                  <View style={styles.side}>
                     <TouchableOpacity
                        onPress={() => navigation.toggleDrawer()}
                     >
                        <Feather name="menu" color="#AD00FF" size={24} />
                     </TouchableOpacity>
                  </View>
               </View>
               <ScrollView
                  style={{ height: "100%" }}
                  refreshControl={
                     <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                     />
                  }
               >
                  <Accordion
                     sections={reservations}
                     activeSections={activeSections}
                     renderSectionTitle={_renderSectionTitle}
                     renderHeader={_renderHeader}
                     renderContent={_renderContent}
                     renderFooter={_renderFooter}
                     onChange={_updateSections}
                  />
               </ScrollView>
            </View>
         )}
      </>
   );
}

const styles = StyleSheet.create({
   container: {
      alignItems: "center",
      // justifyContent: 'center',
      backgroundColor: "#EBEBEB",
      height: "100%",
   },
   header: {
      paddingRight: 24,
      paddingLeft: 24,
      paddingBottom: 8,
      paddingTop: 24 + Constants.statusBarHeight,
      backgroundColor: "#FFF",
      width: "100%",
      // marginBottom: 8,
      flexDirection: "row",
      alignContent: "center",
      justifyContent: "space-between",
   },
   center: {
      alignItems: "center",
      justifyContent: "center",
      height: 52,
   },
   side: {
      width: 42,
      height: 52,
      alignItems: "center",
      justifyContent: "center",
   },
   profileName: {
      fontFamily: "Raleway_800ExtraBold",
      fontStyle: "normal",
      fontWeight: "800",
      fontSize: 24,
      lineHeight: 28,
      color: "#AD00FF",
      textAlign: "center",
   },
   containerAbove: {
      padding: 6,
      flexDirection: "row",
      // borderColor: '#000',
      // borderWidth: 1,
   },
   infoContainer: {
      flexDirection: "column",
      // borderColor: '#000',
      // borderWidth: 1,
      width: "80%",
      paddingHorizontal: 6,
   },
   nameInfo: {
      // height: 24,
      // justifyContent: 'center',
      // borderColor: '#000',
      // borderWidth: 1,
      marginBottom: 6,
   },
   nameText: {
      fontSize: 18,
   },
   dateContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      height: 18,
      marginBottom: 6,
      // borderColor: '#000',
      // borderWidth: 1,
   },
   iconContainer: {
      // alignItems: 'center',
      justifyContent: "center",
      borderColor: "#8F8F8F",
      // borderWidth: 1,
      borderLeftWidth: 0.7,
      marginLeft: "2%",
      width: "18%",
      alignItems: "center",
   },
   content: {
      backgroundColor: "#FFF",
      paddingHorizontal: 12,
   },
   detailsText: {
      paddingBottom: 4,
   },
   footerActive: {
      backgroundColor: "#FFF",
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 1,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 20,
      // elevation: 6,
      borderBottomWidth: 3,
      borderColor: "#AD00FF",
   },
   footer: {
      backgroundColor: "#FFF",
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 1,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 20,
      // elevation: 6,
   },
   buttonEnter: {
      // borderColor: '#000',
      // borderWidth: 1,
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
      backgroundColor: "#28d453",
      width: "100%",
      height: 42,
      justifyContent: "center",
      alignItems: "center",
   },
   buttonLeave: {
      // borderColor: '#000',
      // borderWidth: 1,
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
      backgroundColor: "#FF0077",
      width: "100%",
      height: 42,
      justifyContent: "center",
      alignItems: "center",
   },
   buttonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#FFF",
   },
});
