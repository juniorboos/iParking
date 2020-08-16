import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Feather, MaterialIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { CommonActions } from "@react-navigation/native";
import {
   DrawerContentScrollView,
   DrawerItem,
   DrawerItemList
} from '@react-navigation/drawer';
import Constants from 'expo-constants';
import firebase from '../../services/firebase';

export function SideMenu(props) {

   const [selectedPage, setSelectedPage] = useState('Home');

   const user = {
		email: firebase.auth().currentUser.email,
		name: firebase.auth().currentUser.displayName,
	};


   function handleNavigate ( value ) {
      setSelectedPage(value);
      props.navigation.navigate(value)
   }

   const createTwoButtonAlert = () =>
    Alert.alert(
      "Logout",
      "Are you sure you want to Logout ?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
        },
        { text: "Yes", 
          onPress: () => Logout() }
      ],
      { cancelable: false }
    );

   function Logout() {
		firebase
			.auth()
			.signOut()
			.then(() => {
				props.navigation.dispatch(
					CommonActions.reset({
						index: 0,
						routes: [{ name: "Login" }],
					})
				);
			});
	}

   return (
      <View style={styles.drawerContainer}>
         <DrawerContentScrollView {...props}>
            <View style={{ flex: 1 }}>
               <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
               </View>
               <View>
                  {/* <DrawerItem
                     label="Teste" 
                     icon={() => <MaterialIcons name="home" size={24}/>}
                     onPress={() => handleNavigate('Home')}
                  /> */}
                  <DrawerItemList 
                     activeTintColor='#AD00FF' 
                     activeBackgroundColor='#EBEBEB'
                     labelStyle={styles.presetTitle}
                     // itemStyle={styles.drawerItem}
                     
                     {...props} />
                  <TouchableOpacity style={selectedPage == 'Home' ? styles.presetSelected : styles.preset} onPress={() => handleNavigate('Home')}>
                     <View style={styles.buttonIcon}>
                        <Text>
                           <MaterialIcons name="home" size={24} style={selectedPage == 'Home' ? styles.presetIconSelected : styles.presetIcon}/>
                        </Text>
                     </View>
                     <View style={styles.presetText}>
                        <Text style={selectedPage == 'Home' ? styles.presetTitleSelected : styles.presetTitle}>
                           Home
                        </Text>
                     </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={selectedPage == 'Balance' ? styles.presetSelected : styles.preset} onPress={() => handleNavigate('Balance')}>
                     <View style={styles.buttonIcon}>
                        <Text>
                           <MaterialIcons name="account-balance-wallet" size={24} style={selectedPage == 'Balance' ? styles.presetIconSelected : styles.presetIcon} />
                        </Text>
                     </View>
                     <View style={styles.presetText}>
                        <Text style={selectedPage == 'Balance' ? styles.presetTitleSelected : styles.presetTitle}>
                           Balance
                        </Text>
                     </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={selectedPage == 'History' ? styles.presetSelected : styles.preset} onPress={() => handleNavigate('History')}>
                     <View style={styles.buttonIcon}>
                        <Text>
                           <MaterialIcons name="history" size={24} style={selectedPage == 'History' ? styles.presetIconSelected : styles.presetIcon} />
                        </Text>
                     </View>
                     <View style={styles.presetText}>
                        <Text style={selectedPage == 'History' ? styles.presetTitleSelected : styles.presetTitle}>
                           History
                        </Text>
                     </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={selectedPage == 'Profile' ? styles.presetSelected : styles.preset} onPress={() => handleNavigate('Profile')}>
                     <View style={styles.buttonIcon}>
                        <Text>
                           <AntDesign name="user" size={24} style={selectedPage == 'Profile' ? styles.presetIconSelected : styles.presetIcon} />
                        </Text>
                     </View>
                     <View style={styles.presetText}>
                        <Text style={selectedPage == 'Profile' ? styles.presetTitleSelected : styles.presetTitle}>
                           Profile
                        </Text>
                     </View>
                  </TouchableOpacity>
               </View>
            </View>
         </DrawerContentScrollView>
         <View style={styles.bottomDrawerSection}>
            <TouchableOpacity style={selectedPage == 'Settings' ? styles.presetSelected : styles.preset} onPress={() => handleNavigate('Settings')}>
               <View style={styles.buttonIcon}>
                  <Text>
                     <MaterialIcons name="settings" size={24} style={selectedPage == 'Settings' ? styles.presetIconSelected : styles.presetIcon} />
                  </Text>
               </View>
               <View style={styles.presetText}>
                  <Text style={selectedPage == 'Settings' ? styles.presetTitleSelected : styles.presetTitle}>
                     Settings
                  </Text>
               </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.preset} onPress={() => createTwoButtonAlert()}>
               <View style={styles.buttonIcon}>
                  <Text>
                     <MaterialCommunityIcons name="logout-variant" size={24} style={styles.presetIcon} />
                  </Text>
               </View>
               <View style={styles.presetText}>
                  <Text style={styles.presetTitle}>
                     Logout
                        </Text>
               </View>
            </TouchableOpacity>
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   drawerContainer: {
      flex: 1,
      backgroundColor: '#EBEBEB',
      paddingTop: Constants.statusBarHeight,
   },
   drawerItem: {
      backgroundColor: '#000',
      borderColor: '#000',
      borderWidth: 1,
      width: '100%'
   },

   userInfo: {
      paddingBottom: 16,
      marginBottom: 16,
      marginHorizontal: 16,
      textAlign: 'center',
      alignItems: 'center',
      borderBottomColor: '#C4C4C4',
      borderBottomWidth: 1
   },

   userName: {
      fontFamily: 'Raleway_800ExtraBold',
      fontStyle: 'normal',
      fontWeight: "800",
      lineHeight: 24,
      fontSize: 24,
      color: '#555555'
   },

   userEmail: {
      fontFamily: 'Raleway_500Medium',
      fontStyle: 'normal',
      fontWeight: "500",
      lineHeight: 20,
      fontSize: 14,
      color: '#555555'
   },

   drawerItem: {
      flexDirection: 'row',
      alignItems: 'center',
   },

   preset: {
      marginBottom: 4,
      height: 52,
      flexDirection: 'row',
      overflow: 'hidden',
      alignItems: 'center',
   },

   presetSelected: {
      marginBottom: 4,
      height: 52,
      flexDirection: 'row',
      overflow: 'hidden',
      alignItems: 'center',
      borderStartColor: '#AD00FF',
      borderStartWidth: 6,
   },

   presetIcon: {
      color: "#333333"
   },

   presetIconSelected: {
      color: "#AD00FF"
   },

   presetText: {
      flex: 1,
   },

   presetTitle: {
      fontFamily: 'Raleway_600SemiBold',
      fontStyle: 'normal',
      fontWeight: '600',
      justifyContent: 'center',
      // color: '#555555',
      fontSize: 18,
   },

   presetTitleSelected: {
      fontFamily: 'Raleway_600SemiBold',
      fontStyle: 'normal',
      fontWeight: '600',
      justifyContent: 'center',
      color: '#AD00FF',
      fontSize: 18,
   },

   buttonIcon: {
      height: 60,
      width: 60,
      justifyContent: 'center',
      alignItems: 'center'
   },

   bottomDrawerSection: {
      marginBottom: 16,
  },
});