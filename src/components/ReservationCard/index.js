import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { MaterialIcons as Icon } from '@expo/vector-icons';

export default function ReservationCard() {
	return (
		<View style={styles.container}>
         <View style={styles.containerAbove}>
            <View style={styles.infoContainer}>
               <View style={styles.nameInfo}>
                  <Text style={styles.nameText}>Polytechnic Institute of Bragança</Text>
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
               <Icon name="location-on" color="#000" size={32} />
            </View>
         </View>	
         <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Enter spot</Text>
         </View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
      position: 'absolute',
      bottom: 8,
      marginHorizontal: '2%',
      width: '96%',
      // height: 90,
      flexDirection: 'column',
      borderRadius: 20,
      // borderColor: '#000',
      // borderWidth: 1,
      backgroundColor: '#FFF',
      justifyContent: 'center',
      // marginBottom: 14,
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
   buttonContainer: {
      // borderColor: '#000',
      // borderWidth: 1,
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
      backgroundColor: '#FF0077',
      width: '100%',
      height: 42,
      justifyContent: 'center',
      alignItems: 'center'
   },
   buttonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFF'
   }
	
});