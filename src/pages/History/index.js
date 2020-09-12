import React, { useState, useEffect } from 'react';
import { Feather, MaterialIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { View, StyleSheet, Text, TextInput, ScrollView, Alert, TouchableOpacity, Slider } from 'react-native';
import firebase, { db } from "../../services/firebase.js";
import Accordion from 'react-native-collapsible/Accordion';
import Swiper from 'react-native-swiper';

export default function History({ navigation }) {

   const userId = firebase.auth().currentUser.uid;
   const [activeSections, setActiveSections] = useState([])
   const [reservations, setReservations] = useState([])

   async function loadReservations () {
         const reservationsList = [];
         const snapshot = await db.collection('Users').doc(userId).collection('Requests').where('status', '==', 'Finished').get();
         snapshot.forEach(doc => {
            const timeFrom = doc.data().timeFrom.toDate()
            const timeTo = doc.data().timeTo.toDate()
            const timeFromDisplay = (timeFrom.toTimeString()).split(':')[0] + ':' + (timeFrom.toTimeString()).split(':')[1]
            const timeToDisplay = (timeTo.toTimeString()).split(':')[0] + ':' + (timeTo.toTimeString()).split(':')[1]
            reservationsList.push({id: doc.id, ...doc.data(), timeFromDisplay: timeFromDisplay, timeToDisplay: timeToDisplay})
         })
         setReservations(reservationsList)
         console.log("Reservations: ")
         console.log(reservationsList)
      }

   useEffect(() => {
      loadReservations();
   },[])


   const _renderSectionTitle = section => {
      return (
        <View style={styles.content}>
        </View>
      );
   };
   
   const _renderHeader = section => {
      return (
         <View style={{backgroundColor: '#FFF', marginTop: 8, borderBottomWidth:0.2, borderColor: '#FFF'}}>
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
                        <Text>{section.timeFromDisplay} - {section.timeToDisplay}</Text>
                     </View>
                  </View>
               </View>
               <TouchableOpacity style={styles.iconContainer} onPress={() => goToMaps(section)}>
                  <MaterialIcons name="location-on" color={"#000"} size={32} />
               </TouchableOpacity>
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

   const _renderFooter = (section, content, isActive) => {
      return (
         <View>
            <View style={isActive ? styles.footerActive : styles.footer}>
               {isActive ? 
               <MaterialIcons name="keyboard-arrow-up" size={28} color="#AD00FF" /> 
               : <MaterialIcons name="keyboard-arrow-down" size={28} color="#AD00FF" />}
            </View>
            
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
               <Text style={styles.profileName}>History</Text>
            </View>
            <View style={styles.side}>
               <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                  <Feather name="menu" color="#AD00FF" size={24} />
               </TouchableOpacity>
            </View>
         </View>
         <View style={styles.headerOptions}>
            <TouchableOpacity style={styles.options}>
               <Text>All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options}>
               <Text>Bicycle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options}>
               <Text>Car</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options}>
               <Text>Motorcycle</Text>
            </TouchableOpacity>
         </View>
         <ScrollView style={{height: '100%'}} >
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
   wrapper: {},
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
   headerOptions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%',
      height: 40,
      backgroundColor: '#FFF',
   },
   options : {
      width: '25%',
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: '#000',
      borderRightWidth: 0.5,
      borderLeftWidth: 0.5,

   },
   slide1: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#9DD6EB'
   },
   slide2: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#97CAE5'
   },
   slide3: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#92BBD9'
   },
   text: {
      color: '#fff',
      fontSize: 30,
      fontWeight: 'bold'
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
   footerActive: {
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
   footer: {
      backgroundColor: '#FFF',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 1,
      shadowOffset: {width: 0, height: 3},
      shadowRadius: 20,
      // elevation: 6,
   },
})