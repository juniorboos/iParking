import React, { useState } from "react";
import { Feather } from '@expo/vector-icons';
import { View, TextInput, Text, StyleSheet } from "react-native";
import { Picker } from 'react-native'

export default function SelectInput({ label = "", ...props }) {
   return (
      <View>
         <Text style={styles.label}>{label}</Text>
         <View style={styles.container}>
            <Picker
            style={{ height: 64, marginHorizontal:20 }}
               {...props}
            >
               <Picker.Item label="IPB" value="ipb" />
               <Picker.Item label="ESTiG" value="estig" />
               <Picker.Item label="Bicycle" value="bicycle" />
            </Picker>
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   label: {
      color: "#6C6C80",
      fontSize: 14,
      marginTop: 14,
      marginBottom: 8,
   },
   container: {
      justifyContent:'center',
      borderRadius: 20,
      backgroundColor: '#FFF',
      height: 64,
   }
});

const pickerSelectStyles = StyleSheet.create({
   inputIOS: {
      height: 64,
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 10,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
   },
   inputAndroid: {
      height: 64,
      backgroundColor: '#FFF',
      fontSize: 16,
      marginBottom: 8,
      paddingHorizontal: 24,
      borderColor: 'purple',
      borderRadius: 20,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
   },
});