import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './pages/Login';
import Register from './pages/Register';
import RoutesDrawer from './routesDrawer';
import NewReservation from './pages/NewReservation';

const Stack = createStackNavigator();

const Routes = () => {
   return (
      <Stack.Navigator
         headerMode="none"
         screenOptions={{
            cardStyle: {
               backgroundColor: '#EBEBEB'
            }
         }}
      >
         <Stack.Screen name="Login" component={Login} />
         <Stack.Screen name="Register" component={Register} />
         <Stack.Screen name="RoutesDrawer" component={RoutesDrawer} />
         <Stack.Screen name="NewReservation" component={NewReservation} />

      </Stack.Navigator>
   )
}

export default Routes;
