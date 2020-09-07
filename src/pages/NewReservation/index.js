import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { View, StyleSheet, Text, TextInput, ScrollView, Alert, TouchableOpacity, Slider, ActivityIndicator } from 'react-native';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import AppBar from "../../components/AppBar";
import Input from "../../components/Input";
import Button from "../../components/Button";
import NumericInput from 'react-native-numeric-input';
import DateTimePicker from '@react-native-community/datetimepicker';
// import { Picker } from '@react-native-community/picker';
import { Picker } from 'react-native'
import SelectInput from '../../components/SelectInput';
import LoadingScreen from '../../components/LoadingScreen';
import firebase, { db } from "../../services/firebase.js";
import api from "../../services/api";
import { database } from 'firebase';

export default function NewReservation({ navigation, route }) {
   const [parkings, setParkings] = useState([])
   const [regions, setRegions] = useState([])
   const [vehicles, setVehicles] = useState([])
   const userId = firebase.auth().currentUser.uid;
   const [parking, setParking] = useState()
   const [region, setRegion] = useState('estig')
   const [vehicle, setVehicle] = useState('bicycle')
   const [spot, setSpot] = useState(1);
   const [maxPrice, setMaxPrice] = useState(3);
   const [date, setDate] = useState(new Date());
   const [timeFrom, setTimeFrom] = useState(new Date());
   const [timeTo, setTimeTo] = useState(new Date());
   const [range, setRange] = useState(500);
   const [priorityLocation, setPriorityLocation] = useState(50);
   const [loading, setLoading] = useState(false);
   const [mode, setMode] = useState('date');
   const [show, setShow] = useState(false);
   const [dateMode, setDateMode] = useState();
   const [readData, setReadData] = useState(false)
   const [timeFromDisplay, setTimeFromDisplay] = useState('')
   const [timeToDisplay, setTimeToDisplay] = useState('')

   const spotId = 0;
   const status = "entrar";

   useEffect(() => {
      async function loadVehicles () {
         const vehiclesList = [];
         const snapshot = await db.collection('Users').doc(userId).collection('Vehicles').get();
         snapshot.forEach(doc => {
            vehiclesList.push({id: doc.id, name: doc.data().model, ...doc.data()})
         })
         setVehicles(vehiclesList)
         // console.log("Vehicles: ")
         // console.log(vehiclesList)
      }
      setParkings(route.params)
      loadVehicles()
      const time = timeFrom.toLocaleTimeString().split(':')
      setTimeFromDisplay(time[0] + ':' + time[1])
      setTimeToDisplay(time[0] + ':' + time[1])
   }, [])

   // useEffect(() => {
   //    console.log("Escutando...")
   //    const onValueChange = firebase.database()
   //      .ref(`/Users/${userId}`)
   //      .on('value', snapshot => {
   //          createButtonAlert("Success", snapshot.val().spot);
   //          console.log('User data: ', snapshot.val().spot);
   //      });
  
   //    // Stop listening for updates when no longer required
   //    // return () =>
   //    //   database()
   //    //     .ref(`/users/${userId}`)
   //    //     .off('value', onValueChange);
   //  }, [userId]);
   
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
  
   function handleSpot () {
      const data = {
         initialDate: (date.toISOString().split('T')[0]).toString(),
         endDate: (date.toISOString().split('T')[0]).toString(),
         initialTime: (timeFrom.getHours() + ":" + timeFrom.getMinutes() + ":00").toString(),
         endTime: (timeTo.getHours() + ":" + timeTo.getMinutes() + ":00").toString(),
         spotId: spot,
         driverId: userId
      }

      if (status == "entrar") {
         console.log("Entrando no spot...")
         api.post('usespot', data).then(response => {
            const responseBody = JSON.parse(response.data)
            console.log(responseBody);
            if (responseBody.reservation == true) {
               createButtonAlert("Success", `${responseBody.spot} - R$ ${responseBody.price}`);
            }else {
               createButtonAlert("Failed", "Error in reservation.");
            }
         }).then(() => {
            status = "sair"
            // return navigation.navigate('Home');
         })
      }

      if (status == "sair") {
         console.log("Saindo do spot...")
         api.post('leavespot', data).then(response => {
            const responseBody = JSON.parse(response.data)
            console.log(responseBody);
            if (responseBody == "arriving") {
               createButtonAlert("Success", "Entrando na vaga.");
            }
            if (responseBody == "departuring") {
               createButtonAlert("Success", "Saindo da vaga.");
            }
         }).then(() => {
            status = "entrar"
            // return navigation.navigate('Home');
         })
      }      
   }

   function KillAgent () {

      const data = {
         driverId: userId,
         location: region,
         price: maxPrice,
         initialDate: (date.toISOString().split('T')[0]).toString(),
         endDate: (date.toISOString().split('T')[0]).toString(),
         initialTime: (timeFrom.getHours() + ":" + timeFrom.getMinutes() + ":00").toString(),
         endTime: (timeTo.getHours() + ":" + timeTo.getMinutes() + ":00").toString()
      }

      api.post('kill', data).then(response => {
         const responseBody = JSON.parse(response.data)
         console.log(responseBody);
      }).then(() => {
         // return navigation.navigate('Home');
      })
   }

   function timeTest () {
      const actualDate = new Date()
      const timestampFrom = (new Date(date.getFullYear(), date.getMonth(), date.getDate(), timeFrom.getHours(), timeFrom.getMinutes(), 0, 0))
      const timestampTo = (new Date(date.getFullYear(), date.getMonth(), date.getDate(), timeTo.getHours(), timeTo.getMinutes(), 0, 0))
      const timestampFrom2 = timestampFrom.toISOString()
      const timestampFrom3 = new Date(timestampFrom2)
      console.log(timestampFrom)
      console.log(timestampFrom3)
   }
   
   async function sendNewReservation () {
      setLoading(true)
      const timestampFrom = new Date(date.getFullYear(), date.getMonth(), date.getDate(), timeFrom.getHours(), timeFrom.getMinutes(), 0, 0)
      const timestampTo = new Date(date.getFullYear(), date.getMonth(), date.getDate(), timeTo.getHours(), timeTo.getMinutes(), 0, 0)
      
      console.log('Parking: ' + parking);
      console.log('ParkingName: ' + (parkings.find( ({ id }) => id === parking)).name);
      console.log('Region: ' + region);
      console.log('VehicleId: ' + vehicle);
      console.log('VehicleModel: ' + (vehicles.find( ({ id }) => id === vehicle)).name);
      console.log('Spot wanted: ' + spot);
      console.log('Max price: ' + maxPrice)
      console.log('Date: ' + (date.toISOString().split('T')[0]).toString());
      console.log('Time from: ' + timestampFrom.toISOString());
      const timefrom1 = timestampFrom.toISOString()
      const timeFrom2 = new Date(timefrom1).toTimeString()
      const timeFromDisplay = (timeFrom2).split(':')[0] + ':' + (timeFrom2).split(':')[1]
      console.log('Time from 2: ', timeFromDisplay)
      console.log('Time to: ' + timeToDisplay);
      console.log('Range: ' + range);
      console.log('Priority location: ' + priorityLocation);
      console.log('Priority price: ' + (100 - priorityLocation));
      console.log('User id: ' + userId);

      async function confirmSpot (decision, requestId, responseData) {
         if (decision == "accept"){
            console.log(requestId)
            db.collection('Users').doc(userId).collection('Requests').doc(requestId).update({
               spotWon: responseData.spot,
               priceWon: responseData.price,
               status: "Accepted",
               userStatus: false
            })
         } else {
            db.collection('Users').doc(userId).collection('Requests').doc(requestId).update({
               spotWon: responseData.spot,
               priceWon: responseData.price,
               status: "Declined"
            })
         }
         await database().ref('Users/' + userId + '/Request/').remove()
         setLoading(false) 
         navigation.navigate('Home')
      }

      db.collection('Users').doc(userId).collection('Requests').add({
         parking: parking,
         parkingName: (parkings.find( ({ id }) => id === parking)).name,
         region: region,
         vehicleModel: (vehicles.find( ({ id }) => id === vehicle)).name,
         vehicleId: vehicle,
         spotWanted: spot,
         maxPrice: maxPrice,
         date: (date.toISOString().split('T')[0]).toString(),
         timeFrom: timestampFrom.toISOString(),
         timeTo: timestampTo.toISOString(),
         distanceRange: range,
         locationWeight: priorityLocation,
         priceWeight: 100 - priorityLocation
      }).then((response) => {
         console.log("added")
         console.log(response.id)
         // const data = {
         //    driverId: userId,
         //    location: region,
         //    price: maxPrice,
         //    initialDate: (date.toISOString().split('T')[0]).toString(),
         //    endDate: (date.toISOString().split('T')[0]).toString(),
         //    initialTime: (timeFrom.getHours() + ":" + timeFrom.getMinutes() + ":00").toString(),
         //    endTime: (timeTo.getHours() + ":" + timeTo.getMinutes() + ":00").toString()
         // }

         // api.post('request', data).then(response => {
         //    const responseBody = JSON.parse(response.data)
         //    console.log(responseBody);
         //    if (responseBody.reservation == true) {
         //       createButtonAlert("Success", `${responseBody.spot} - R$ ${responseBody.price}`);
         //       spotId = responseBody.spot;
         //    }else {
         //       createButtonAlert("Failed", "Error in reservation.");
         //    }
         // }).then(() => {
         //    // return navigation.navigate('Home');
         // })

         console.log("Aguardando resposta... ")
         const userRef = firebase.database().ref('Users/' + userId).child('Request')
         userRef.on('value', snapshot => {
            console.log("Encontrou")
            if(snapshot.val() != null && readData == false) {
               setReadData(true)
               console.log(snapshot.val());
               if(snapshot.val().reservation == "true"){
                  Alert.alert(
                     "Success",
                     "You won the spot: " + snapshot.val().spot.toString() + " at the price of €" + snapshot.val().price,
                     [
                        { 
                           text: "Decline",
                           onPress: () => confirmSpot("decline", response.id, snapshot.val()) 
                        },
                        {
                           text: "Accept", 
                           onPress: () => confirmSpot("accept", response.id, snapshot.val())
                        }
                     ],
                     { cancelable: false }
                  );
               } else {
                  Alert.alert(
                     "Failed",
                     "No spot available",
                     [
                        {
                           text: "OK", 
                           onPress: () => console.log("OK Pressed")
                        }
                     ],
                     { cancelable: false }
                  );
               }
               
            }
         });      
      }).catch(erro => {
         setIsLoading(false);
         console.log(erro);
         return createButtonAlert("Error", "Erro ao cadastrar usuario no banco de dados.");
      });
   }

   function handleNavigationBack() {
      navigation.goBack();
   }

   const onChangeParking = (itemValue, itemIndex) => {
      setParking(itemValue)
      // console.log(itemValue)
      
      db.collection('Parkings').doc(itemValue).collection('Regions').get()
         .then(response => {
            const regionsList = [];
            response.forEach(doc => {
               regionsList.push({id: doc.id, ...doc.data()})
            })
            setRegions(regionsList)
         })
   }

   const onChangeDate = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      const time = currentDate.toLocaleTimeString().split(':')
      setShow(Platform.OS === 'ios');
      switch (dateMode) {
         case 'date':
            setDate(currentDate);
            break;
         case 'timeFrom':
            setTimeFrom(currentDate);
            setTimeFromDisplay(time[0] + ':' + time[1])
            break;
         case 'timeTo':
            setTimeTo(currentDate);
            setTimeToDisplay(time[0] + ':' + time[1])
            break;
      }
   }

   const showMode = currentMode => {
      setShow(true);
      setMode(currentMode);
   };

   const showDatepicker = () => {
      showMode('date');
      setDateMode('date');
   };

   const showTimeFrompicker = () => {
      showMode('time');
      setDateMode('timeFrom')
   };

   const showTimeTopicker = () => {
      showMode('time');
      setDateMode('timeTo')
   };

   return (
      <>
      {loading == true ? (
         <LoadingScreen />
      ):(
      <View style={styles.wrapper}>
         
         <AppBar
            renderLeft={
               <TouchableOpacity onPress={handleNavigationBack}>
                  <Feather name="chevron-left" size={24} color="#AD00FF" />
               </TouchableOpacity>
            }
            renderCenter={
               <Text style={styles.header}>New reservation</Text>
            }
         />

         <ScrollView vertical showsVerticalScrollIndicator={false}>
            <SelectInput
               label="Smart parking"
               pickerItens={parkings}
               mode="dialog"
               selectedValue={parking}
               onValueChange={onChangeParking}/>
            <SelectInput
               label="Region"
               pickerItens={regions}
               mode="dialog"
               selectedValue={region}
               onValueChange={(itemValue, itemIndex) => setRegion(itemValue)}/>
            <SelectInput
               label="Vehicle"
               pickerItens={vehicles}
               mode="dialog"
               selectedValue={vehicle}
               onValueChange={(itemValue, itemIndex) => setVehicle(itemValue)}/>
            <View style={styles.smallInput}>
               <View>
                  <Text style={styles.labelNumeric}>Spot wanted</Text>
                  <NumericInput
                     type='up-down'
                     rounded
                     totalHeight={64}
                     totalWidth={140}
                     minValue={1}
                     maxValue={6}
                     containerStyle={styles.numericContainer}
                     onChange={setSpot} />
               </View>

               <View>
                  <Text style={styles.label}>Maximum price</Text>
                  <View style={styles.priceSection}>
                     {/* <Feather style={styles.priceIcon} name="chevron-left" size={24} color="#AD00FF" /> */}
                     <Text style={styles.priceIcon}>{'\u20AC'}</Text>
                     <TextInput keyboardType="numeric" placeholder="5,00" style={styles.inputPrice} autoCompleteType="off" onChangeText={setMaxPrice} />
                  </View>
               </View>
            </View>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity style={styles.input} onPress={showDatepicker}>
               <Text style={styles.dateText}>
                  {date.toDateString()}
               </Text>
            </TouchableOpacity>
            {show && (
               <DateTimePicker
                  value={date}
                  is24Hour={true}
                  minimumDate={new Date()}
                  mode={mode}
                  display="default"
                  onChange={onChangeDate} />
            )}
            <View style={styles.smallInput}>
               <View style={styles.smallInputContainer}>
                  <Text style={styles.label}>From</Text>
                  <TouchableOpacity style={styles.pickerTime} onPress={showTimeFrompicker}>
                     <Text style={styles.dateText}>
                        {timeFromDisplay}
                     </Text>
                  </TouchableOpacity>
               </View>
               <View style={styles.smallInputContainer}>
                  <Text style={styles.label}>To</Text>
                  <TouchableOpacity style={styles.pickerTime} onPress={showTimeTopicker}>
                     <Text style={styles.dateText}>
                        {timeToDisplay}
                     </Text>
                  </TouchableOpacity>
               </View>
            </View>
            <Text style={styles.label}>Distance range for spot:
               <Text style={{ color: '#AD00FF', fontSize: 16, fontWeight: 'bold' }}> {range}m</Text>
            </Text>
            <Slider
               style={{ width: '100%' }}
               thumbTintColor="#AD00FF"
               minimumTrackTintColor="#A871C1"
               animationType="timing"
               step={100}
               minimumValue={0}
               maximumValue={1000}
               value={range}
               onValueChange={setRange}
            />
            <Text style={styles.label}>Priority:</Text>
            <View style={{flex: 1, flexDirection:'row', justifyContent:'space-between', }}>
               <Text style={[styles.label, { width: '50%', alignItems: 'flex-start', textAlign: 'left' }]}>Location:
                  <Text style={{ color: '#AD00FF', fontSize: 16, fontWeight: 'bold' }}> {priorityLocation}%</Text>
               </Text>
               <Text style={[styles.label, { width: '50%', alignSelf: 'flex-end', textAlign: 'right' }]}>Price:
                  <Text style={{ color: '#AD00FF', fontSize: 16, fontWeight: 'bold' }}> {100 - priorityLocation}%</Text>
               </Text>
            </View>

            <Slider
               style={{ width: '100%' }}
               thumbTintColor="#AD00FF"
               minimumTrackTintColor="#A871C1"
               maximumTrackTintColor="#0037ff"
               animationType="timing"
               step={10}
               minimumValue={0}
               maximumValue={100}
               value={priorityLocation}
               onValueChange={setPriorityLocation}
            />
            <Text style={styles.observation}>* Higher priority in location results in higher price</Text>
            <Text style={styles.observation}>* Higher priority in price results in further location</Text>


         </ScrollView>
         <HideWithKeyboard style={styles.footer}>
            <Button
               backgroundColor="#AD00FF"
               color="#FFFFFF"
               fontSize={24}
               justify="center"
               onPress={() => sendNewReservation()}
            >
               Find a Spot
            </Button>
            {/* <Button
               backgroundColor="#AD00FF"
               color="#FFFFFF"
               fontSize={24}
               justify="center"
               onPress={() => KillAgent()}
            >
               Kill
            </Button>
            <Button
               backgroundColor="#AD00FF"
               color="#FFFFFF"
               fontSize={24}
               justify="center"
               onPress={() => handleSpot()}
            >
               Enter / Leave
            </Button> */}
         </HideWithKeyboard>
      </View>
      )}
      </>
   );
}

const styles = StyleSheet.create({
   dateText: {
      // height: '100%',
      backgroundColor: '#FFF',
      fontSize: 20,
      // marginBottom: 8,
      paddingHorizontal: 24,
      borderColor: 'purple',
      borderRadius: 20,
      color: 'black',
      paddingRight: 30,
   },
   labelNumeric: {
      color: "#6C6C80",
      marginTop: 14,
      marginBottom: 8,
   },
   pickerDate: {
      height: 64,
      width: '100%',
      backgroundColor: "#FFF",
      borderRadius: 20,
      paddingTop: 12,
      alignSelf: 'center',
      alignContent: 'center',
      alignItems: 'center',
   },
   pickerTime: {
      // flex: 1,
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',

      width: '100%',
      height: 64,
      backgroundColor: "#FFF",
      borderRadius: 20,
      // paddingTop: 12,
      
   },
   priceSection: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 20,
      width: 150,
      height: 64,
   },
   priceIcon: {
      width: '40%',
      justifyContent: 'flex-start',
      textAlign: 'center',
      fontSize: 24
   },
   inputPrice: {
      height: 64,
      width: '60%',
      backgroundColor: '#fff',
      color: '#424242',
      fontSize: 24,
      borderRadius: 20,
   },
   numericContainer: {
      alignItems: 'center',
      backgroundColor: '#FFF',
   },
   smallInput: {
      // flex: 1,
      justifyContent: "space-between",
      flexDirection: 'row',
   },
   smallInputContainer: {
      width: '45%',
   },
   wrapper: {
      flex: 1,
      paddingRight: 32,
      paddingLeft: 32,
      paddingBottom: 8,
      paddingTop: 24 + Constants.statusBarHeight,
   },
   observation: {
      marginTop: 8,
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
   header: {
      fontSize: 24,
      color: "#AD00FF",
      fontWeight: 'bold'
   },
   input: {
		height: 64,
		backgroundColor: "#FFF",
		borderRadius: 20,
		marginBottom: 8,
		paddingHorizontal: 40,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
	},
});