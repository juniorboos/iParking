import React, { useState, useEffect } from 'react';
import { Feather, MaterialIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { View, StyleSheet, Text, TextInput, ScrollView, Alert, TouchableOpacity, Slider } from 'react-native';
import firebase, { db } from "../../services/firebase.js";
import { LinearGradient } from 'expo-linear-gradient'

export default function Profile({ navigation }) {
   return (
      <View style={styles.container}>
         <LinearGradient
          colors={['#AD00FF', '#E950D0', '#C7A9D6' ]}
          style={styles.linearGradient}
        >
           <View style={styles.wrapper}>
               <View style={styles.side}>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                     <Feather name="chevron-left" size={24} color="#AD00FF" />
                  </TouchableOpacity>
               </View>
               <View style={styles.center}>
                  <Text styles={styles.profileName}>Joseph Joestar</Text>
               </View>
               <View style={styles.side}>
               
               </View>
            </View>
          <Text>Profile page</Text>
        </LinearGradient>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      alignItems: 'center',
      justifyContent: 'center',
   },
   linearGradient: {
      paddingRight: 32,
      paddingLeft: 32,
      paddingBottom: 8,
      paddingTop: 24 + Constants.statusBarHeight,
      alignItems: 'center',
      justifyContent: 'center',
      height: 160,
      width: '100%',
   },
   wrapper: {
      width: "100%",
      height: 52,
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: "space-between"
    },
    center: {
      alignContent: 'center',
      justifyContent: "center",
    },
    side: {
      width: 42,
      height: 52,
      alignItems: "flex-start",
      justifyContent: "center"
    },
    profileName: {
      // fontFamily: 'Raleway',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 24,
      lineHeight: 28,
      color: '#FFFFFF'
    }
})