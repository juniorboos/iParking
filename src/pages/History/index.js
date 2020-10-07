import React, { useState, useEffect, useCallback } from 'react';
import { Feather, MaterialIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { View, StyleSheet, Text, Linking, ScrollView, Platform, TouchableOpacity, RefreshControl } from 'react-native';
import firebase, { db } from "../../services/firebase.js";
import Accordion from 'react-native-collapsible/Accordion';
import Swiper from 'react-native-swiper';

export default function History({ navigation }) {

   const userId = firebase.auth().currentUser.uid;
   const [activeSections, setActiveSections] = useState([])
   const [reservations, setReservations] = useState([])
   const [vehicles, setVehicles] = useState([])
   const [bikeHistory, setBikeHistory] = useState([])
   const [carHistory, setCarHistory] = useState([])
   const [motorcycleHistory, setMotorcycleHistory] = useState([])
   const [option, setOption] = useState('All')
   const [refreshing, setRefreshing] = useState(false)
   const [loading, setLoading] = useState(false)

   async function loadReservations (vehiclesList) {
      const reservationsList = [];
      const snapshot = await db.collection('Users').doc(userId).collection('Requests').where('status', '==', 'Finished').get();
      // console.log('Vehicles2: ', vehiclesList)
      snapshot.forEach(doc => {
         const timeFrom = doc.data().timeFrom.toDate()
         const timeTo = doc.data().timeTo.toDate()
         const timeFromDisplay = (timeFrom.toTimeString()).split(':')[0] + ':' + (timeFrom.toTimeString()).split(':')[1]
         const timeToDisplay = (timeTo.toTimeString()).split(':')[0] + ':' + (timeTo.toTimeString()).split(':')[1]
         const vehicleId = doc.data().vehicleId

         const vehicleType =  vehiclesList.find( ({ id }) => id == vehicleId)
         console.log("Vehicle Type: ", vehicleType.type)
         reservationsList.push({id: doc.id, ...doc.data(), timeFromDisplay: timeFromDisplay, timeToDisplay: timeToDisplay, vehicleType: vehicleType.type})
      })
      setReservations(reservationsList)
      reservationsList.sort(function(a,b){
         return b.timeFrom.toDate() - a.timeFrom.toDate();
      });
      // console.log("Reservations: ")
      // console.log(reservationsList)
      setBikeHistory(reservationsList.filter(reservation => reservation.vehicleType == 'Bicycle'))
      setCarHistory(reservationsList.filter(reservation => reservation.vehicleType == 'Car'))
      setMotorcycleHistory(reservationsList.filter(reservation => reservation.vehicleType == 'Motorcycle'))
   }

   async function loadVehicles () {
      const vehiclesList = []
      const snapshot = await db.collection('Users').doc(userId).collection('Vehicles').get()
      snapshot.forEach(doc => {
         vehiclesList.push({id: doc.id, ... doc.data()})
      })
      setVehicles(vehiclesList)
      // console.log("Vehicles1: ")
      // console.log(vehiclesList)
      return vehiclesList
   }

   useEffect(() => {
      loadVehicles().then((vehiclesList) => {loadReservations(vehiclesList)})
   },[])

   async function goToMaps (request) {
      console.log('go to parking: ', request.parking)
      const ref = db.collection('Parkings').doc(request.parking)
      const doc = await ref.get()

      const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
      const latLng = `${doc.data().coordinates[0]},${doc.data().coordinates[1]}`;
      const label = 'Custom Label';
      const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
      });


      Linking.openURL(url); 
   }


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
      console.log(activeSections)

   };

   function switchHistory (option) {
      setOption(option)
      setActiveSections([])
   }

   const onRefresh = useCallback(() => {
      setRefreshing(true);
      loadReservations().then(() => {
         setBikeHistory(reservations.filter(reservation => reservation.vehicleType == 'Bicycle'))
         setCarHistory(reservations.filter(reservation => reservation.vehicleType == 'Car'))
         setMotorcycleHistory(reservations.filter(reservation => reservation.vehicleType == 'Motorcycle'))

         setRefreshing(false)
      })
   }, [])

   return (
      <View style={styles.container} >
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
            <TouchableOpacity style={styles.options} onPress={() => switchHistory('All')}>
               <Text style={option == 'All' ? styles.focused : null}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options} onPress={() => switchHistory('Bicycle')}>
               <Text style={option == 'Bicycle' ? styles.focused : null}>Bicycle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options} onPress={() => switchHistory('Car')}>
               <Text style={option == 'Car' ? styles.focused : null}>Car</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options} onPress={() => switchHistory('Motorcycle')}>
               <Text style={option == 'Motorcycle' ? styles.focused : null}>Motorcycle</Text>
            </TouchableOpacity>
         </View>
         <ScrollView contentContainerStyle={{height: '100%', width: '100%', backgroundColor: '#CCC'}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
               <Accordion
                  sections={
                     option == 'All' ? reservations :
                     option == 'Bicycle' ? bikeHistory :
                     option == 'Car' ? carHistory :
                     motorcycleHistory}
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
   focused: {
      color: '#AD00FF',
      fontWeight: "bold"
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