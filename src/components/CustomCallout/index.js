import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { Feather as Icon } from '@expo/vector-icons';

import { RectButton } from "react-native-gesture-handler";

export default function CustomCallout(props) {
   const { title } = props

	return (
		<View style={styles.containerCallout}>
         <Text style={styles.calloutText}>{title}</Text>
         <RectButton 
            style={styles.button} 
            onPress={() => navigation.navigate("NewReservation")}>
            <Text style={styles.buttonText}>
               Check spots
            </Text>
            <Icon name="chevron-right" color="#FFF" size={24} />
         </RectButton>
      </View>
	);
}

const styles = StyleSheet.create({
	containerCallout: {
      margin: 8,
      width: 150,
      alignItems: 'center',
   },
   calloutText: {
      textAlign: 'center',
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8
   },
   button: {
      backgroundColor: "#AD00FF",
      height: 40,
      borderRadius: 10,
      // maxWidth: 100,
      flexDirection: 'row',
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'space-evenly'
   },
   buttonIcon: {
      height: 60,
      width: 10,
      // backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
   },
   buttonText: {
      // width: '50%',
      flex: 1,
      justifyContent: 'center',
      paddingStart: 16,
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold'
   },

});