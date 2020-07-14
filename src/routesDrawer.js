import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { SideMenu } from './components/SideMenu';
import Home from './pages/Home';
import Balance from './pages/Balance';
import History from './pages/History';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const Drawer = createDrawerNavigator();

const RoutesDrawer = () => {
   return (
      <Drawer.Navigator
         drawerContent={(props) => <SideMenu {...props} />}
         drawerPosition='right'
         screenOptions={{
            cardStyle: {
               backgroundColor: '#EBEBEB'
            },
         }}>
         <Drawer.Screen name="Home" component={Home} />
         <Drawer.Screen name="Balance" component={Balance} />
         <Drawer.Screen name="History" component={History} />
         <Drawer.Screen name="Profile" component={Profile} />
         <Drawer.Screen name="Settings" component={Settings} />
      </Drawer.Navigator>
   )
}

export default RoutesDrawer;
