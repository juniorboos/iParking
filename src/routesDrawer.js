import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { SideMenu } from './components/SideMenu';
import Home from './pages/Home';
import NewReservation from './pages/NewReservation';

const Drawer = createDrawerNavigator();

const RoutesDrawer = () => {
   return (
      <Drawer.Navigator
         drawerPosition='right'
         screenOptions={{
            cardStyle: {
               backgroundColor: '#EBEBEB'
            },
         }}>
         <Drawer.Screen name="Home" component={Home} />
      </Drawer.Navigator>
   )
}

export default RoutesDrawer;
