import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

export default function LoadingScreen() {
	return (
		<View style={styles.container}>
         <LinearGradient
            colors={['#AD00FF', '#E950D0', '#C7A9D6' ]}
            style={styles.linearGradient}
         >
            <ActivityIndicator size="large" color="#FFF" />
        </LinearGradient>	
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
      width: '100%',
      height: '100%',
	},
	linearGradient: {
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%',
   },
});