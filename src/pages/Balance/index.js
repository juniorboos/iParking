import React, { useState, useEffect } from 'react';
import { Feather, MaterialIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { View, StyleSheet, Text, TextInput, ScrollView, Alert, TouchableOpacity, Slider } from 'react-native';
import firebase, { db } from "../../services/firebase.js";

export default function Balance({ navigation }) {
   return (
      <View>
         <Text>Balance page</Text>
      </View>
   )
}

const styles = StyleSheet.create({})