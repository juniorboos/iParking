import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import {
   DrawerContentScrollView,
   DrawerItem
} from '@react-navigation/drawer';
import Constants from 'expo-constants';

export function SideMenu(props) {
   const [selectedPage, setSelectedPage] = useState('home');

   return (
      <View style={styles.drawerContainer}>
         <DrawerContentScrollView {...props}>
            <View style={{ flex: 1 }}>
               <View style={styles.userInfo}>
                  <Text style={styles.userName}>Joseph Smith</Text>
                  <Text style={styles.userEmail}>josephsmith@gmail.com</Text>
               </View>
               <View>
                  <TouchableOpacity style={selectedPage == 'home' ? styles.presetSelected : styles.preset} onPress={() => setSelectedPage('home')}>
                     <View style={styles.buttonIcon}>
                        <Text>
                           <MaterialIcons name="home" size={24} style={selectedPage == 'home' ? styles.presetIconSelected : styles.presetIcon}/>
                        </Text>
                     </View>
                     <View style={styles.presetText}>
                        <Text style={selectedPage == 'home' ? styles.presetTitleSelected : styles.presetTitle}>
                           Home
                        </Text>
                     </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={selectedPage == 'balance' ? styles.presetSelected : styles.preset} onPress={() => setSelectedPage('balance')}>
                     <View style={styles.buttonIcon}>
                        <Text>
                           <MaterialIcons name="account-balance-wallet" size={24} style={selectedPage == 'balance' ? styles.presetIconSelected : styles.presetIcon} />
                        </Text>
                     </View>
                     <View style={styles.presetText}>
                        <Text style={selectedPage == 'balance' ? styles.presetTitleSelected : styles.presetTitle}>
                           Balance
                        </Text>
                     </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={selectedPage == 'history' ? styles.presetSelected : styles.preset} onPress={() => setSelectedPage('history')}>
                     <View style={styles.buttonIcon}>
                        <Text>
                           <MaterialIcons name="history" size={24} style={selectedPage == 'history' ? styles.presetIconSelected : styles.presetIcon} />
                        </Text>
                     </View>
                     <View style={styles.presetText}>
                        <Text style={selectedPage == 'history' ? styles.presetTitleSelected : styles.presetTitle}>
                           History
                        </Text>
                     </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={selectedPage == 'profile' ? styles.presetSelected : styles.preset} onPress={() => setSelectedPage('profile')}>
                     <View style={styles.buttonIcon}>
                        <Text>
                           <AntDesign name="user" size={24} style={selectedPage == 'profile' ? styles.presetIconSelected : styles.presetIcon} />
                        </Text>
                     </View>
                     <View style={styles.presetText}>
                        <Text style={selectedPage == 'profile' ? styles.presetTitleSelected : styles.presetTitle}>
                           Profile
                        </Text>
                     </View>
                  </TouchableOpacity>
               </View>
            </View>
         </DrawerContentScrollView>
         <View style={styles.bottomDrawerSection}>
            <TouchableOpacity style={selectedPage == 'settings' ? styles.presetSelected : styles.preset} onPress={() => setSelectedPage('settings')}>
               <View style={styles.buttonIcon}>
                  <Text>
                     <MaterialIcons name="settings" size={24} style={selectedPage == 'settings' ? styles.presetIconSelected : styles.presetIcon} />
                  </Text>
               </View>
               <View style={styles.presetText}>
                  <Text style={selectedPage == 'settings' ? styles.presetTitleSelected : styles.presetTitle}>
                     Settings
                  </Text>
               </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.preset}>
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
      color: '#555555',
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