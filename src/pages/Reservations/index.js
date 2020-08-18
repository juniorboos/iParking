import React, { useState, useEffect } from 'react';
import { Feather, MaterialIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { View, StyleSheet, Text, TextInput, ScrollView, Alert, TouchableOpacity, Slider } from 'react-native';
import firebase, { db } from "../../services/firebase.js";
import Accordion from 'react-native-collapsible/Accordion';

export default function Reservations({ navigation }) {
   const SECTIONS = [
      {
        parking: 'Polytechnic Institute of Bragança',
        region: 'ESTiG',
        vehicle: 'Bicycle',
        spot: 2,
        timeFrom: '10:00',
        timeTo: '12:00',
        date: '3 Fev, 2020',
        price: '€ 4,25'
      },
      {
        parking: 'Polytechnic Institute of Bragança',
        region: 'ESTiG',
        vehicle: 'Bicycle',
        spot: 2,
        timeFrom: '10:00',
        timeTo: '12:00',
        date: '3 Fev, 2020',
        price: '€ 4,25'
      },
      {
        parking: 'Polytechnic Institute of Bragança',
        region: 'ESTiG',
        vehicle: 'Bicycle',
        spot: 2,
        timeFrom: '10:00',
        timeTo: '12:00',
        date: '3 Fev, 2020',
        price: '€ 4,25'
      },
    ];
    
   
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
        <View style={{backgroundColor: '#FFF', marginBottom: 8}}>
          <View style={styles.containerAbove}>
            <View style={styles.infoContainer}>
               <View style={styles.nameInfo}>
                  <Text style={styles.nameText}>{section.parking}</Text>
               </View>
               <View style={styles.dateContainer}>
                  <View>
                     <Text>3 Fev, 2020</Text>
                  </View>
                  <View>
                     <Text>10:00 - 15:00</Text>
                  </View>
               </View>
            </View>
            <View style={styles.iconContainer}>
               <Feather name="location-on" color="#000" size={32} />
            </View>
         </View>
        </View>
      );
    };
   
   const _renderContent = section => {
      return (
        <View style={styles.content}>
          <Text>{section.parking}</Text>
          <Text>{section.region}</Text>
          <Text>{section.vehicle}</Text>
          <Text>{section.spot}</Text>
        </View>
      );
    };
   
   const _updateSections = activeSections => {
      setActiveSections(activeSections)
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
         <View>
            <Accordion
               sections={SECTIONS}
               activeSections={activeSections}
               renderSectionTitle={_renderSectionTitle}
               renderHeader={_renderHeader}
               renderContent={_renderContent}
               onChange={_updateSections}
            />
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      alignItems: 'center',
      // justifyContent: 'center',
      backgroundColor: '#b8b6b6',
      height: '100%'
   },
   header: {
      paddingRight: 24,
      paddingLeft: 24,
      paddingBottom: 8,
      paddingTop: 24 + Constants.statusBarHeight,
      backgroundColor: '#FFF',
      width: "100%",
      marginBottom: 16,
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
      // height: 18,
      // marginBottom: 6,
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
})