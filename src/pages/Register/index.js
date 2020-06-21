import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { View, Image, StyleSheet, Text, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import AppBar from "../../components/AppBar";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function Register({navigation}) {

   function handleNavigationBack() {
		navigation.goBack();
	}

   return (
      <View style={styles.wrapper}>
         <AppBar
            renderLeft={
               <TouchableOpacity onPress={handleNavigationBack}>
                  <Feather name="chevron-left" size={24} color="#AD00FF" />
               </TouchableOpacity>
            }
            renderCenter={
               <Image source={require('../../assets/logo.png')} />
            }
         />

         <Text style={styles.title}>Create new account</Text>

         <ScrollView vertical showsVerticalScrollIndicator={false}>
            <Input
               label="Full name"
               placeholder="Your name"
            />
            <Input
               label="Phone number"
               keyboardType="phone-pad"
               placeholder="+351"
            />
            <Input
               label="E-mail"
               keyboardType="email-address"
               placeholder="user@domain.com"
               autoCorrect={false}
            />
            <Input
               label="Password"
               placeholder="********"
               secureTextEntry={true}
            />
            <Input
               label="Repeat Password"
               placeholder="********"
               secureTextEntry={true}
            />

         </ScrollView>
         <HideWithKeyboard style={styles.footer}>
            <Button
               backgroundColor="#AD00FF"
               color="#FFFFFF"
               fontSize={24}
               justify="center"
            >
               Sign In
         </Button>
         </HideWithKeyboard>
      </View>
   );
}

const styles = StyleSheet.create({
   wrapper: {
      flex: 1,
      paddingRight: 32,
      paddingLeft: 32,
      paddingBottom: 8,
      paddingTop: 24 + Constants.statusBarHeight,
   },
   observation: {
      fontSize: 12,
      textAlign: "right",
      color: "#bd2843",
   },
   title: {
      fontWeight: "bold",
      fontSize: 16,
      marginTop: 16,
      marginBottom: 8,
   },
   label: {
      flex: 1,
      color: "#6C6C80",
      fontSize: 14,
      marginTop: 14,
      marginBottom: 8,
   },
   footer: {
      width: "100%",
      height: 75,
   },
});