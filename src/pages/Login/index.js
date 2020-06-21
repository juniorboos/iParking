import React from 'react';
import Constants from 'expo-constants';
import { View, ImageBackground, Text, Image, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

import Input from "../../components/Input";
import Button from '../../components/Button';

export default function Login({ navigation }) {

   return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
         <ImageBackground
            source={require('../../assets/splash.png')}
            style={styles.container}
            imageStyle={{ width: 295, height: 482 }}>
            <View style={styles.image}>
               <Image source={require('../../assets/logo.png')} />
            </View>
            <View style={styles.main}>
               <Input
                  label="E-mail"
                  placeholder="user@domain.com"
                  keyboardType={"email-address"}
               />
               <Input
                  label="Password"
                  placeholder="*******"
                  secureTextEntry={true}
                  autoCompleteType={"off"}
               />
               <Button
                  backgroundColor="#AD00FF"
						color="#FFFFFF"
						fontSize={24}
						justify="center"
                  onPress={() => navigation.navigate("Home")}>
                     Login
               </Button>
            </View>
            <View style={styles.footer}>
               <Text style={styles.description}>Don’t have an account? 
                  <Text style={styles.signup} onPress={() => navigation.navigate("Register")}> Sign up!</Text>
               </Text>
            </View>
         </ImageBackground>
      </KeyboardAvoidingView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 32,
   },

   image: {
      alignSelf: 'center',
      paddingTop: 35 + Constants.statusBarHeight,
   },

   main: {
      flex: 1,
      justifyContent: 'center',
   },

   title: {
      color: '#322153',
      fontSize: 32,
      maxWidth: 260,
      marginTop: 64,
   },

   description: {
      textAlign: 'center',
      color: '#333333',
      fontSize: 16,
      maxWidth: 260,
      lineHeight: 24,
   },

   signup: {
      color: '#AD00FF',
      fontWeight: 'bold',
   },

   footer: {
      alignSelf: 'center',
   },

   select: {},

   input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
   },

   button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
   },

   buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
   },

   buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
   }
   
});