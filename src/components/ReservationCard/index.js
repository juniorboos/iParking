import React from "react";
import { View, StyleSheet, Text } from "react-native";

export default function ReservationCard() {
	return (
		<View style={styles.container}>
         {/* Above */}
         <View style={styles.containerAbove}>
            {/* Left */}
            <View style={styles.infoContainer}>
               {/* Above */}
               <View>
                  <Text>Polytechnic Institute of Bragança</Text>
               </View>
               {/* Under */}
               <View style={styles.dateContainer}>
                  {/* Left */}
                  <View>
                     <Text>3 Fev, 2020</Text>
                  </View>
                  {/* Right */}
                  <View>
                     <Text>10:00 - 15:00</Text>
                  </View>
               </View>
            </View>
            {/* Right */}
            <View style={styles.iconContainer}>
               <Text>Icon</Text>
            </View>
         </View>	
         {/* Button */}
         <View style={styles.buttonContainer}>
            <Text>Enter spot</Text>
         </View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
      width: '100%',
      height: 90,
      flexDirection: 'column',
      borderRadius: 20,
      borderColor: '#000',
      borderWidth: 1,
      backgroundColor: '#FFF',
      justifyContent: 'center',
      // marginBottom: 14,
   },
   containerAbove: {
      padding: 6,
      flexDirection: 'row',
      borderColor: '#000',
      borderWidth: 1,
   },
   infoContainer: {
      flexDirection: 'column',
      borderColor: '#000',
      borderWidth: 1,
      width: '80%',
      paddingHorizontal: 6,
   },
   dateContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderColor: '#000',
      borderWidth: 1,
   },
   iconContainer: {
      // alignItems: 'center',
      justifyContent: 'center',
      borderColor: '#000',
      borderWidth: 1,
      width: '20%',
      alignItems: 'center'
   },
   buttonContainer: {
      borderColor: '#000',
      borderWidth: 1,
      width: '100%',
      height: '40%',
      justifyContent: 'center',
      alignItems: 'center'
   }
	
});