import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { View, Image, StyleSheet, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import AppBar from "../../components/AppBar";
import Input from "../../components/Input";
import Button from "../../components/Button";

import firebase, { db } from '../../services/firebase';

export default function Register({ navigation }) {
   const [isLoading, setIsLoading] = useState(false);

   const [form, setForm] = useState({
      fullName: "",
      phone: "",
      email: "",
      password: "",
      repassword:"",
   });

   const onInput = (field, value) => {
      setForm(state => ({
         ...state,
         [field]: value
      }))
   };

   function handleNavigationBack() {
      navigation.goBack();
   }

   const createButtonAlert = (title, msg) => {
      Alert.alert(
         title,
         msg,
         [
            { text: "OK" }
         ],
         { cancelable: false }
      );
   }

   const onRegistry = () => {
      setIsLoading(true);

      if (form.fullName == "") {
         setIsLoading(false);
         return createButtonAlert("ERRO", "O campo nome deve ser preenchido!");
      }

      if (form.email == "") {
         setIsLoading(false);
         return createButtonAlert("ERRO", "O campo email deve ser preenchido e ser válido!");
      }

      if (form.password == "" || form.password.length < 6) {
         setIsLoading(false);
         return createButtonAlert("ERRO", "O campo password deve ser preenchido e possuir no minimo 6 caracteres!");
      }
      if (form.phone == "") {
         setIsLoading(false);
         return createButtonAlert("ERRO", "O campo telefone deve ser preenchido e deve conter um + no inicio com o DDD!");
      }
      if (form.password != form.repassword) {
         setIsLoading(false);
         return createButtonAlert("ERRO", "As senhas inseridas devem ser as mesmas!");
      }

      firebase.auth()
         .createUserWithEmailAndPassword(form.email, form.password)
         .then(authUser => {
            var user = firebase.auth().currentUser;
            const userId = firebase.auth().currentUser.uid;
            if (user != null) {
               user.updateProfile({
                  displayName: form.fullName,
               }).then(function () {
                  db.collection('Users').doc(userId).set(
                     { email: form.email, fullName: form.fullName, phone: form.phone }
                  ).then(() => {
                     createButtonAlert("Success", "Registration Successful!!");
                     return navigation.navigate('Login');
                  }).catch(erro => {
                     setIsLoading(false);
                     console.log(erro);
                     return createButtonAlert("Error", "Erro ao cadastrar usuario no banco de dados.");
                  });
               });
            } else {
               createButtonAlert("Success", "Registration Successful!!");
               return navigation.navigate('Login');
            }
         })
         .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
               setIsLoading(false);
               return createButtonAlert('ERROR', 'That email address is already in use!');
            }

            if (error.code === 'auth/invalid-email') {
               setIsLoading(false);
               return createButtonAlert('ERROR', 'That email address is invalid!');
            }

            setIsLoading(false);
            console.error(error);
         });
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
               onChangeText={(e) => onInput("fullName", e)}
            />
            <Input
               label="Phone number"
               keyboardType="phone-pad"
               placeholder="+351"
               onChangeText={(e) => onInput("phone", e)}
            />
            <Input
               label="E-mail"
               keyboardType="email-address"
               placeholder="user@domain.com"
               autoCorrect={false}
               onChangeText={(e) => onInput("email", e)}
            />
            <Input
               label="Password"
               placeholder="********"
               secureTextEntry={true}
               onChangeText={(e) => onInput("password", e)}
            />
            <Input
               label="Repeat Password"
               placeholder="********"
               secureTextEntry={true}
               onChangeText={(e) => onInput("repassword", e)}
            />

         </ScrollView>
         <HideWithKeyboard style={styles.footer}>
            <Button
               backgroundColor="#AD00FF"
               color="#FFFFFF"
               fontSize={24}
               justify="center"
               onPress={onRegistry}
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