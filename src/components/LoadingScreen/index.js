import React from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function LoadingScreen(props) {
   const { message = "" } = props;

   return (
      <View style={styles.container}>
         <LinearGradient
            colors={["#AD00FF", "#E950D0", "#C7A9D6"]}
            style={styles.linearGradient}
         >
            <Text style={styles.message}>{message}</Text>
            <ActivityIndicator size="large" color="#FFF" />
         </LinearGradient>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      width: "100%",
      height: "100%",
   },
   linearGradient: {
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "100%",
   },
   message: {
      color: "white",
      fontSize: 18,
      marginBottom: 12,
   },
});
