import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Feed from './screens/feed';
import Profile from './screens/profile';
import Upload from './screens/upload';
import Comments from './screens/comments';
import UserProfile from './screens/userProfile';


import { auth } from './config/config';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


export default function App() {
  useEffect(()=> {
      logIn()
  },[]);

  const logIn = async () => {
    try {
      let user = await auth.signInWithEmailAndPassword('test@gmail.com', '1234567')
    }catch(error) {
      console.log(error);
    }
  }

  const BarNav = () => {
    return(
      <Tab.Navigator>
        <Tab.Screen name="Feed" component={Feed} />
        <Tab.Screen name="Upload" component={Upload} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName='Home' 
        mode='modal'
        headerMode='none'
        >
        <Stack.Screen name="Home" component={BarNav}/>
        <Stack.Screen name="User" component={UserProfile}/>
        <Stack.Screen name="Comments" component={Comments}/>
      </Stack.Navigator>
    </NavigationContainer>  );
}


