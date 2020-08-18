import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Feather, MaterialIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

import { SideMenu } from './components/SideMenu';
import Home from './pages/Home';
import Balance from './pages/Balance';
import History from './pages/History';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Reservations from './pages/Reservations';

const Drawer = createDrawerNavigator();

const RoutesDrawer = () => {
   return (
      <Drawer.Navigator
         drawerContent={(props) => <SideMenu {...props} />}
         drawerContentOptions={{
            activeBackgroundColor: '#eabdff',
            itemStyle: { 
               marginHorizontal: 0, 
               paddingLeft: 12, 
               borderRadius: 0,
               // borderStartColor: '#AD00FF',
               // borderStartWidth: 6,
            }
         }}
         drawerPosition='right'
         screenOptions={{
            cardStyle: {
               backgroundColor: '#EBEBEB'
            },
         }}>
         <Drawer.Screen name="Home" component={Home} options={{drawerIcon: props => (<MaterialIcons name="home" size={24} color={props.color} />)}} />
         <Drawer.Screen name="Balance" component={Balance} options={{drawerIcon: props => (<MaterialIcons name="account-balance-wallet" size={24} color={props.color} />)}}/>
         <Drawer.Screen name="Reservations" component={Reservations} options={{drawerIcon: props => (<Feather name="bookmark" size={24} color={props.color} />)}}/>
         <Drawer.Screen name="History" component={History} options={{drawerIcon: props => (<MaterialIcons name="history" size={24} color={props.color} />)}}/>
         <Drawer.Screen name="Profile" component={Profile} options={{drawerIcon: props => (<AntDesign name="user" size={24} color={props.color} />)}}/>
         <Drawer.Screen name="Settings" component={Settings} options={{drawerIcon: props => (<MaterialIcons name="settings" size={24} color={props.color} />)}}/>
      </Drawer.Navigator>
   )
}

export default RoutesDrawer;
