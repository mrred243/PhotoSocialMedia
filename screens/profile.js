import React, { useState, useEffect } from 'react';
import { styles } from '../styles'
import { FlatList, Text, Image, View, StyleSheet, Button } from 'react-native';
import { f, auth, database, storage } from '../config/config.js';

import PhotoList from '../component/photoList';


export default Profile = ({navigation, route}) => {
    const [ loggedIn, setLoggedIn] = useState(false);
    const [ userId, setUserId] = useState('');

    useEffect(() => {
        f.auth().onAuthStateChanged(user => {
            if(user){
                setLoggedIn(true);
                setUserId(user.uid);
            } else{
                setLoggedIn(false);
            }
        });
    },
        []);
    
    return (
        <View style={styles.container}>
            {
                loggedIn == true ? (
                    <View style={{flex: 1}}>
                        <View style={{ height: 70, paddingTop: 30, borderBottomWidth: 0.5, borderColor: 'lightgrey', justifyContent: 'center', alignItems: 'center' }}>
                            <Text>Profile</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingVertical: 10}}>
                            <Image source={{uri: 'https://api.adorable.io/avatars/285/test@user.i.png'}}
                                style={{marginLeft: 10, width: 100, height: 100, borderRadius: 50, backgroundColor: 'blue'}}
                            />
                            <View style={{marginRight: 10, }}>
                                <Text>Name</Text>
                                <Text>@username</Text>
                            </View>
                        </View>
                        <View style={{borderBottomWidth: 0.5, paddingVertical: 20}}>
                            <Button title='Edit profile' />
                            <Button title='Log out'/>
                        </View>
                        {
                            userId == '' ? (
                                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text>Loading ...</Text>
                                </View>
                            ) : (
                                <PhotoList isUser={true} userId={userId} navigation={navigation} />
                            )
                        }
                    </View>                   
                    ) : (
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text>You are not logged in.</Text>
                        <Text>Please log in to view your profile</Text>
                    </View>
                )
            }
        </View>
    )
}