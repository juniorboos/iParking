import React, { useState, useEffect } from 'react';
import { Feather, MaterialIcons, FontAwesome, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { View, StyleSheet, Text, TextInput, ScrollView, Alert, TouchableOpacity, Slider } from 'react-native';
import firebase, { db } from "../../services/firebase.js";
import { LinearGradient } from 'expo-linear-gradient'
import Modal from 'react-native-modal';
import Input from '../../components/Input'
import SelectInput from '../../components/SelectInput'
import { RectButton } from "react-native-gesture-handler";

export default function Profile({ navigation }) {
   const userId = firebase.auth().currentUser.uid;
   const vehicleTypes = [{
      name: 'Bicycle',
      id: 'Bicycle'
   },
   {
      name: 'Motorcycle',
      id: 'Motorcycle'
   },
   {
      name: 'Car',
      id: 'Car'
   }]
   const [modalState, setModalState] = useState(false)
   const [userData, setUserData] = useState({});
   const [vehicles, setVehicles] = useState([])
   const [vehicleType, setVehicleType] = useState('Bicycle')
   const [vehicleModel, setVehicleModel] = useState('')
   const [vehiclePlate, setVehiclePlate] = useState('')

   useEffect(() => {      
      loadUser()
      loadVehicles()
   },[])

   function displayModal (show) {
      setModalState(show)
   }

   async function loadUser() {
      await db.collection('Users').doc(userId).get()
         .then((doc) => setUserData(doc.data()))
   }
   
   async function loadVehicles() {
      const vehiclesList = []
      const snapshot = await db.collection('Users').doc(userId).collection('Vehicles').get()
      snapshot.forEach(doc => {
         console.log(doc.data())
         vehiclesList.push({id: doc.id, ... doc.data()})
      })
      setVehicles(vehiclesList);
   }

   async function addVehicle () {
      console.log('entrou')
      await db.collection('Users').doc(userId).collection('Vehicles').add({
         type: vehicleType,
         model: vehicleModel,
         plate: vehiclePlate
      }).then(() => {
         console.log("Vehicle added!")
         loadVehicles()
         displayModal(false)
         Alert.alert("Vehicle added!");
      })
   }

   return (
      <View style={styles.container}>
         <LinearGradient
          colors={['#AD00FF', '#E950D0', '#C7A9D6' ]}
          style={styles.linearGradient}
        >
           <Modal
               isVisible={modalState}
               onBackdropPress={() => displayModal(false)}>
               <View style={styles.modalView}>
                  <SelectInput 
                     label="Type"
                     pickerItens={vehicleTypes}
                     mode="dropdown"
                     selectedValue={vehicleType}
                     onValueChange={(itemValue, itemIndex) => setVehicleType(itemValue)}/>
                  <Input label="Model" placeholder="Ford Fiesta" onChangeText={setVehicleModel} />
                  {vehicleType != 'Bicycle' ? 
                     <Input label="License plate" placeholder="MC-11-22" onChangeText={setVehiclePlate} />
                  : null }
                  <TouchableOpacity 
                     style={styles.button} 
                     onPress={addVehicle}>
                     <Text style={styles.buttonText}>
                        Add vehicle
                     </Text>
                  </TouchableOpacity>

               </View>
            </Modal>


           <View style={styles.header}>
               <View style={styles.side}>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                     <Feather name="chevron-left" size={24} color="#FFF" />
                  </TouchableOpacity>
               </View>
               <View style={styles.center}>
                  <Text style={styles.profileName}>{userData.fullName}</Text>
               </View>
               <View style={styles.side}>
                  <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                     <Feather name="menu" color="#FFF" size={24} />
                  </TouchableOpacity>
               </View>
            </View>
            <View style={styles.cardContainer}>
               <View style={styles.labelContainer}>
                  <Text style={styles.cardLabel}>Personal Information</Text>
               </View>
               <View style={styles.personalInfo}>
                  <View style={styles.infoContainer}>
                     <View style={styles.infoField}>
                        <Feather name="mail" size={24} color="#000" style={styles.infoIcon}/>
                        <Text style={styles.fieldLabel}>{userData.email}</Text>
                     </View>
                     <View style={styles.infoField}>
                        <Feather name="phone" size={24} color="#000" style={styles.infoIcon}/>
                        <Text>+{userData.phone}</Text>
                     </View>
                  </View>
                  <TouchableOpacity style={styles.editInfo} onPress={() => console.log()}>
                     <Feather name="edit" color="#000" size={24} />
                  </TouchableOpacity>
               </View>
            </View>
            <View style={styles.cardContainer}>
               <View style={styles.labelContainer}>
                  <Text style={styles.cardLabel}>Vehicles</Text>
                  <TouchableOpacity style={styles.vehicleEditIcons} onPress={() => displayModal(true)}>
                     <Feather name="plus" color="#8A19BF" size={24} />
                  </TouchableOpacity>
               </View>
               <View style={styles.personalInfo}>
                  <View style={styles.vehicleContainer}>
                     {vehicles.map((vehicle, index) => {
                        return (
                           <View key={index} style={styles.vehicleField}>
                              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                 {vehicle.type == 'Bicycle' 
                                 ? <MaterialIcons name="directions-bike" size={24} color="black" style={styles.infoIcon} />
                                 : vehicle.type == 'Motorcycle' 
                                 ? <FontAwesome name="motorcycle" size={24} color="black" style={styles.infoIcon} />
                                 : <FontAwesome name="car" size={24} color="black" style={styles.infoIcon} />}
                                 
                                 <Text style={styles.fieldLabel}>{vehicle.model}</Text>
                              </View>
                              <TouchableOpacity style={styles.vehicleEditIcons} onPress={() => console.log()}>
                                 <Feather name="edit" color="#000" size={24} />
                              </TouchableOpacity>
                           </View>
                        )})}
                  </View>
               </View>
            </View>
        </LinearGradient>
      </View>
   )
}

const styles = StyleSheet.create({
   modalView: {
      backgroundColor: '#EBEBEB',
      borderColor: '#000',
      borderWidth: 1,
      borderRadius: 20,
      padding: 18,
      alignItems: "center",
   },

   container: {
      alignItems: 'center',
      justifyContent: 'center',
   },
   linearGradient: {
      paddingRight: 24,
      paddingLeft: 24,
      paddingBottom: 8,
      paddingTop: 24 + Constants.statusBarHeight,
      alignItems: 'center',
      // justifyContent: 'center',
      height: '100%',
      width: '100%',
   },
   header: {
      width: "100%",
      height: 52,
      marginBottom: 16,
      // borderColor: '#000',
      // borderWidth: 1,
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: "space-between"
   },
   center: {
      alignContent: 'center',
      justifyContent: "center",
   },
   side: {
      width: 42,
      height: 52,
      // borderColor: '#000',
      // borderWidth: 1,
      alignItems: "center",
      justifyContent: "center"
   },
   profileName: {
      fontFamily: 'Raleway_800ExtraBold',
      fontStyle: 'normal',
      fontWeight: '800',
      fontSize: 24,
      lineHeight: 28,
      color: '#FFFFFF'
   },
   cardContainer: {
      width: '100%',
      // borderColor: '#000',
      // borderWidth: 1,
      borderRadius: 10,
      paddingLeft: 16,
      paddingVertical: 16,
      marginBottom: 18,
      backgroundColor: '#FFF',
      shadowColor: "#000",
      shadowOffset: { height: 1, width: 1 }, // IOS
      shadowOpacity: 1, // IOS
      shadowRadius: 1, //IOS
      elevation: 10, // Android
   },
   personalInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      // height: 80
   },
   infoContainer: {
      flexDirection: 'column',
      overflow: 'hidden'
   },
   vehicleContainer: {
      flexDirection: 'column',
      width: '100%'
   },
   infoField: {
      flexDirection: 'row',
      height: 42,
      alignItems: 'center'
   },
   cardLabel: {
      color: '#8A19BF',
      fontSize: 14,
      lineHeight: 18,
      // textAlignVertical: 'center',
      // marginBottom: 8
   },
   fieldLabel: {
      color: '#000',
      fontSize: 14
   },
   infoIcon: {
      width: 50,
   },
   editInfo: {
      width: 50,
      height: 84,
      alignItems: 'center',
      justifyContent: 'center',
      borderLeftColor: '#C4C4C4',
      borderLeftWidth: 1,
   },
   labelContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8
      // borderColor: '#000',
      // borderWidth: 1,
   },
   vehicleEditIcons: {
      width: 50,
      alignItems: 'center',
   },
   vehicleField: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: 42,
      alignItems: 'center'
   },
   button: {
      marginTop: 16,
      backgroundColor: "#AD00FF",
      width: '100%',
      height: 56,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
   },
   buttonText: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: 'bold'
   },

})