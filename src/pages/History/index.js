import React, { useState, useEffect } from 'react';
import { Feather, MaterialIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { View, StyleSheet, Text, TextInput, ScrollView, Alert, TouchableOpacity, Slider } from 'react-native';
import firebase, { db } from "../../services/firebase.js";
import Swiper from 'react-native-swiper';

export default function History({ navigation }) {
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
         <Swiper style={styles.wrapper}>
            <View style={styles.slide1}>
               <Text style={styles.text}>All</Text>
            </View>
            <View style={styles.slide2}>
               <Text style={styles.text}>Bicycle</Text>
            </View>
            <View style={styles.slide3}>
               <Text style={styles.text}>Car</Text>
            </View>
         </Swiper>
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
   }
})