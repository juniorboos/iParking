import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { View, StyleSheet, Text, TextInput, ScrollView, Alert, TouchableOpacity, Slider } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import AppBar from "../../components/AppBar";
import Input from "../../components/Input";
import Button from "../../components/Button";
import SelectInput from "../../components/SelectInput";
import NumericInput from 'react-native-numeric-input';
import DatePicker from 'react-native-datepicker';

export default function NewReservation({ navigation }) {

   const [date, setDate] = useState('15-05-2018');
   const [timeFrom, setTimeFrom] = useState('12:00');
   const [timeTo, setTimeTo] = useState('14:00');
   const [range, setRange] = useState(500);
   const [priorityLocation, setPriorityLocation] = useState(50);
   const [priorityPrice, setPriorityPrice] = useState(50);


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
               <Text style={styles.header}>New reservation</Text>
            }
         />

         <ScrollView vertical showsVerticalScrollIndicator={false}>
            <SelectInput
               label="Smart Parking"
            />
            <SelectInput
               label="Region"
            />
            <SelectInput
               label="Vehicle"
            />
            <View style={styles.smallInput}>
               <View>
                  <Text style={styles.labelNumeric}>Spot wanted</Text>
                  <NumericInput
                     type='up-down'
                     rounded
                     totalHeight={64}
                     totalWidth={140}
                     minValue={0}
                     maxValue={6}
                     containerStyle={styles.numericContainer}
                     onChange={value => console.log(value)} />
               </View>

               <View>
                  <Text style={styles.label}>Maximum price</Text>
                  <View style={styles.priceSection}>
                     {/* <Feather style={styles.priceIcon} name="chevron-left" size={24} color="#AD00FF" /> */}
                     <Text style={styles.priceIcon}>{'\u20AC'}</Text>
                     <TextInput placeholder="5,00" style={styles.inputPrice} autoCompleteType="off" />
                  </View>
               </View>
            </View>
            <Text style={styles.label}>Date</Text>
            <DatePicker
               style={styles.pickerDate}
               date={date} //initial date from state
               mode="date" //The enum of date, datetime and time
               placeholder="select date"
               format="DD/MM/YYYY"
               minDate="06-01-2020"
               maxDate="01-01-2021"
               confirmBtnText="Confirm"
               cancelBtnText="Cancel"
               customStyles={{
                  dateIcon: {
                     position: 'absolute',
                     right: 10,
                     top: 4,
                     marginLeft: 0,
                  },
                  dateInput: {
                     paddingStart: 20,
                     alignItems: "flex-start",
                     alignSelf: "center",
                     justifyContent: "center",
                     borderRadius: 20,
                     borderWidth: 0,
                     height: 64,
                  },
                  dateText: {
                     fontSize: 20
                  }
               }}
               onDateChange={setDate}
            />

            <View style={styles.smallInput}>
               <View>
                  <Text style={styles.label}>From</Text>
                  <DatePicker
                     style={styles.pickerTime}
                     date={timeFrom} //initial date from state
                     mode="time" //The enum of date, datetime and time
                     placeholder="select time"
                     format="HH:mm"
                     confirmBtnText="Confirm"
                     cancelBtnText="Cancel"
                     customStyles={{
                        dateIcon: {
                           display: 'none'
                        },
                        dateInput: {
                           alignItems: "flex-start",
                           alignSelf: "center",
                           justifyContent: "center",
                           borderRadius: 20,
                           borderWidth: 0,
                           height: 64,
                           alignItems: 'center'
                        },

                        dateText: {
                           fontSize: 20
                        }
                     }}
                     onDateChange={setTimeFrom}
                  />
               </View>
               <View>
                  <Text style={styles.label}>To</Text>
                  <DatePicker
                     style={styles.pickerTime}
                     date={timeTo} //initial date from state
                     mode="time" //The enum of date, datetime and time
                     placeholder="select time"
                     format="HH:mm"
                     confirmBtnText="Confirm"
                     cancelBtnText="Cancel"
                     customStyles={{
                        dateIcon: {
                           display: 'none'
                        },
                        dateInput: {
                           alignItems: "flex-start",
                           alignSelf: "center",
                           justifyContent: "center",
                           borderRadius: 20,
                           borderWidth: 0,
                           height: 64,
                           alignItems: 'center'
                        },

                        dateText: {
                           fontSize: 20,
                        }
                     }}
                     onDateChange={setTimeTo}
                  />
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
            <Text style={styles.label}>Priority in location:
               <Text style={{ color: '#AD00FF', fontSize: 16, fontWeight: 'bold' }}> {priorityLocation}%</Text>
            </Text>
            <Slider
               style={{ width: '100%' }}
               thumbTintColor="#AD00FF"
               minimumTrackTintColor="#A871C1"
               animationType="timing"
               step={10}
               minimumValue={0}
               maximumValue={100}
               value={priorityLocation}
               onValueChange={setPriorityLocation}
            />
            <Text style={styles.observation}>* Higher priority results in higher price</Text>
            <Text style={styles.label}>Priority in price:
               <Text style={{ color: '#AD00FF', fontSize: 16, fontWeight: 'bold' }}> {priorityPrice}%</Text>
            </Text>
            <Slider
               style={{ width: '100%' }}
               thumbTintColor="#AD00FF"
               minimumTrackTintColor="#A871C1"
               animationType="timing"
               step={10}
               minimumValue={0}
               maximumValue={100}
               value={priorityPrice}
               onValueChange={setPriorityPrice}
            />
            <Text style={styles.observation}>* Higher priority results in further location</Text>


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

const pickerSelectStyles = StyleSheet.create({
   inputIOS: {
      height: 64,
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 10,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
   },
   inputAndroid: {
      height: 64,
      backgroundColor: '#FFF',
      fontSize: 16,
      marginBottom: 8,
      paddingHorizontal: 24,
      borderColor: 'purple',
      borderRadius: 20,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
   },
});

const styles = StyleSheet.create({

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
      height: 64,
      backgroundColor: "#FFF",
      borderRadius: 20,
      paddingTop: 12,
      alignSelf: 'center',
      alignContent: 'center',
      alignItems: 'center',
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
      flex: 1,
      justifyContent: "space-between",
      flexDirection: 'row',
   },
   wrapper: {
      flex: 1,
      paddingRight: 32,
      paddingLeft: 32,
      paddingBottom: 8,
      paddingTop: 24 + Constants.statusBarHeight,
   },
   observation: {
      marginTop:8,
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
});