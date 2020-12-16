import React, { useState, useEffect } from "react";
import Constants from "expo-constants";
import {
   View,
   ImageBackground,
   Text,
   Image,
   Alert,
   StyleSheet,
   KeyboardAvoidingView,
   Platform,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import firebase from "../../services/firebase.js";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function Login({ navigation }) {
   const [user, setUser] = useState("junior_boos@live.com");
   const [pass, setPass] = useState("123456");

   const createButtonAlert = (title, msg) => {
      Alert.alert(title, msg, [{ text: "OK" }], { cancelable: false });
   };

   useEffect(() => {
      const getLocationPermission = async () => {
         try {
            const { status } = await Location.requestPermissionsAsync();

            if (status !== "granted") {
               Alert.alert(
                  "Ooooops...",
                  "Precisamos de sua permissão para obter a localização"
               );
               return;
            }
         } catch (error) {
            console.log(error);
         }
      };

      const getNotificationPermission = async () => {
         try {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== "granted") {
               Alert.alert(
                  "Ooooops...",
                  "Precisamos de sua permissão para notificações!"
               );
               return;
            }
         } catch (error) {
            console.log(error);
         }
      };

      getLocationPermission().then(() => getNotificationPermission());
   }, []);

   // function sendToCorretRoute() {
   //    firebase
   //       .firestore()
   //       .collection("Users")
   //       .get()
   //       .then((querySnapshot) => {
   //          querySnapshot.forEach((documentSnapshot) => {
   //             if (documentSnapshot.data().email == user) {
   //                navigation.dispatch(
   //                   CommonActions.reset({
   //                      index: 0,
   //                      routes: [{ name: "Home" }],
   //                   })
   //                );
   //             }
   //          });
   //       })
   //       .catch(() => {
   //          console.log("Erro ao buscar Users");
   //       });
   // }

   const loginUser = () => {
      if (user == "" || pass == "") {
         return createButtonAlert("Error", "Empty Field!");
      }

      firebase
         .auth()
         .signInWithEmailAndPassword(user, pass)
         .then(() => {
            console.log("Autenticado - Enviando para rota correta...");
            navigation.reset({
               index: 0,
               routes: [{ name: "RoutesDrawer" }],
            });
            // navigation.dispatch(
            //    CommonActions.reset({
            //       index: 0,
            //       routes: [{ name: "RoutesDrawer" }],
            //    })
            // );
         })
         .catch((error) => {
            createButtonAlert("Error", error.toString());
            if (
               error == "auth/wrong-password" ||
               error ==
                  "The password is invalid or the user does not have a password."
            ) {
               return createButtonAlert("Error", "Wrong Password!");
            }
            if (error == "auth/invalid-email") {
               return createButtonAlert("Error", "Invalid Email!");
            }
            console.log(error);
            // alert(error);
         });
   };

   return (
      <KeyboardAvoidingView
         style={{ flex: 1 }}
         behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
         <ImageBackground
            source={require("../../assets/splash.png")}
            style={styles.container}
            imageStyle={{ width: 295, height: 482 }}
         >
            <View style={styles.image}>
               <Image source={require("../../assets/logo.png")} />
            </View>
            <View style={styles.main}>
               <Input
                  label="E-mail"
                  placeholder="user@domain.com"
                  keyboardType={"email-address"}
                  value={user}
                  onChangeText={(text) => setUser(text)}
               />
               <Input
                  label="Password"
                  placeholder="*******"
                  autoCompleteType={"off"}
                  value={pass}
                  secureTextEntry={true}
                  onChangeText={(text) => setPass(text)}
               />
               <Button
                  backgroundColor="#AD00FF"
                  color="#FFFFFF"
                  fontSize={24}
                  justify="center"
                  onPress={loginUser}
               >
                  Login
               </Button>
            </View>
            <View style={styles.footer}>
               <Text style={styles.description}>
                  Don’t have an account?
                  <Text
                     style={styles.signup}
                     onPress={() => navigation.navigate("Register")}
                  >
                     {" "}
                     Sign up!
                  </Text>
               </Text>
            </View>
         </ImageBackground>
      </KeyboardAvoidingView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 32,
   },

   image: {
      alignSelf: "center",
      paddingTop: 35 + Constants.statusBarHeight,
   },

   main: {
      flex: 1,
      justifyContent: "center",
   },

   title: {
      color: "#322153",
      fontSize: 32,
      maxWidth: 260,
      marginTop: 64,
   },

   description: {
      textAlign: "center",
      color: "#333333",
      fontSize: 16,
      maxWidth: 260,
      lineHeight: 24,
   },

   signup: {
      color: "#AD00FF",
      fontWeight: "bold",
   },

   footer: {
      alignSelf: "center",
   },

   select: {},

   input: {
      height: 60,
      backgroundColor: "#FFF",
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
   },

   button: {
      backgroundColor: "#34CB79",
      height: 60,
      flexDirection: "row",
      borderRadius: 10,
      overflow: "hidden",
      alignItems: "center",
      marginTop: 8,
   },

   buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      justifyContent: "center",
      alignItems: "center",
   },

   buttonText: {
      flex: 1,
      justifyContent: "center",
      textAlign: "center",
      color: "#FFF",
      fontFamily: "Roboto_500Medium",
      fontSize: 16,
   },
});
