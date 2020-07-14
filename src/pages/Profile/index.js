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
           
          <Text>Profile page</Text>
        </LinearGradient>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
   },
   
   linearGradient: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
      height: '100%',
      width: '100%',
   },
})