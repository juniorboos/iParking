import React, { useState, useEffect, useCallback } from 'react';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { View, StyleSheet, Text, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import firebase, { db } from "../../services/firebase.js";
import Accordion from 'react-native-collapsible/Accordion';

export default function Reservations({ navigation }) {
   const [reservations, setReservations] = useState([])
   const [refreshing, setRefreshing] = useState(false)
   const userId = firebase.auth().currentUser.uid;

   async function loadReservations () {
      console.log("carregando...")
      const reservationsList = [];
      const snapshot = await db.collection('Users').doc(userId).collection('Requests').where('status', '==', 'Accepted').get();
      snapshot.forEach(doc => {
         const timeFrom = (doc.data().timeFrom.split('T')[1]).split(':')[0] + ':' + (doc.data().timeFrom.split('T')[1]).split(':')[1]
         const timeTo = (doc.data().timeTo.split('T')[1]).split(':')[0] + ':' + (doc.data().timeTo.split('T')[1]).split(':')[1]
         reservationsList.push({id: doc.id, ...doc.data(), timeFrom: timeFrom, timeTo: timeTo})
      })
      setReservations(reservationsList)
      // console.log("Reservations: ")
      // console.log(reservationsList)
   }

   useEffect(() => {
      loadReservations();
   }, [])

   const onRefresh = useCallback(() => {
      setRefreshing(true);
      loadReservations().then(() => {
         setRefreshing(false)
      })
   }, [])
    
   
   const [activeSections, setActiveSections] = useState([])

   const _renderSectionTitle = section => {
      return (
        <View style={styles.content}>
          {/* <Text>{section.content}</Text> */}
        </View>
      );
    };
   
   const _renderHeader = section => {
      return (
        <View style={{backgroundColor: '#FFF', marginTop: 8,}}>
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
                     <Text>{section.timeFrom} - {section.timeTo}</Text>
                  </View>
               </View>
            </View>
            <View style={styles.iconContainer}>
               <MaterialIcons name="location-on" color="#000" size={32} />
            </View>
         </View>
        </View>
      );
    };
   
   const _renderContent = section => {
      return (
        <View style={styles.content}>
          <Text style={styles.detailsText}>{section.region} - Spot {section.spotWon}</Text>
          <Text style={styles.detailsText}>{section.vehicleModel}</Text>
          <Text style={styles.detailsText}>€ {section.priceWon}</Text>
        </View>
      );
    };

   const _renderFooter = (content, section, isActive) => {
      return (
        <View style={isActive ? styles.footerActive : styles.footer}>
           {isActive ? 
           <MaterialIcons name="keyboard-arrow-up" size={28} color="#AD00FF" /> 
           : <MaterialIcons name="keyboard-arrow-down" size={28} color="#AD00FF" />}
        </View>
      );
    };
   
   const _updateSections = activeSections => {
      setActiveSections(activeSections)
      // console.log(activeSections)
    };

   return (
      <View style={styles.container}>
         <View style={styles.header}>
            <View style={styles.side}>
               <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Feather name="chevron-left" size={24} color="#AD00FF" />
               </TouchableOpacity>
            </View>
            <View style={styles.center}>
               <Text style={styles.profileName}>Reservations</Text>
            </View>
            <View style={styles.side}>
               <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                  <Feather name="menu" color="#AD00FF" size={24} />
               </TouchableOpacity>
            </View>
         </View>
         <ScrollView 
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
   )
}

const styles = StyleSheet.create({
   container: {
      alignItems: 'center',
      // justifyContent: 'center',
      backgroundColor: '#EBEBEB',
      height: '100%'
   },
   header: {
      paddingRight: 24,
      paddingLeft: 24,
      paddingBottom: 8,
      paddingTop: 24 + Constants.statusBarHeight,
      backgroundColor: '#FFF',
      width: "100%",
      // marginBottom: 8,
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: "space-between",
   },
   center: {
      alignItems: 'center',
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
      fontFamily: 'Raleway_800ExtraBold',
      fontStyle: 'normal',
      fontWeight: '800',
      fontSize: 24,
      lineHeight: 28,
      color: '#AD00FF',
      textAlign: 'center',
   },
   containerAbove: {
      padding: 6,
      flexDirection: 'row',
      // borderColor: '#000',
      // borderWidth: 1,
   },
   infoContainer: {
      flexDirection: 'column',
      // borderColor: '#000',
      // borderWidth: 1,
      width: '80%',
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 18,
      marginBottom: 6,
      // borderColor: '#000',
      // borderWidth: 1,
   },
   iconContainer: {
      // alignItems: 'center',
      justifyContent: 'center',
      borderColor: '#8F8F8F',
      // borderWidth: 1,
      borderLeftWidth: 0.7,
      marginLeft: '2%',
      width: '18%',
      alignItems: 'center'
   },
   content: {
      backgroundColor: '#FFF',
      paddingHorizontal: 12,
   },
   detailsText: {
      paddingBottom: 4,
   },
   footer: {
      backgroundColor: '#FFF',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 1,
      shadowOffset: {width: 0, height: 3},
      shadowRadius: 20,
      // elevation: 6,
      borderBottomWidth: 3,
      borderColor: '#AD00FF'
   },
   footerActive: {
      backgroundColor: '#FFF',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 1,
      shadowOffset: {width: 0, height: 3},
      shadowRadius: 20,
      // elevation: 6,
   }
})