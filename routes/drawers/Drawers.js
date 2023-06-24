import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {Ionicons,FontAwesome,MaterialIcons,Entypo} from 'react-native-vector-icons';
import { createDrawerNavigator } from "@react-navigation/drawer";
import LoginScreen from "../../screens/auth/LoginScreen"
import AdminLoginScreen from "../../screens/auth/AdminLoginScreen"
import SellerLoginScreen from "../../screens/auth/SellerLoginScreen"
import RiderLoginScreen from "../../screens/auth/RiderLoginScreen"

const Drawers = () => {
    const Drawer=createDrawerNavigator();
  return (
        <Drawer.Navigator screenOptions={{headerShown: false}}>
            <Drawer.Screen name='login' component={LoginScreen} options={{drawerIcon: () => <Ionicons name="people-sharp" size={24} color="black" />}}/>
            <Drawer.Screen name='AdminLogin' component={AdminLoginScreen} options={{drawerIcon: () => <MaterialIcons name="admin-panel-settings" size={24} color="black" />}}/>
            <Drawer.Screen name='SellerLogin' component={SellerLoginScreen} options={{drawerIcon: () => <Entypo name="shop" size={24} color="black" />}}/>
            <Drawer.Screen name='RiderLogin' component={RiderLoginScreen} options={{drawerIcon: () => <FontAwesome name="motorcycle" size={24} color="black" />}}/>
        </Drawer.Navigator>
  )
}

export default Drawers

const styles = StyleSheet.create({})