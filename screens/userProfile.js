import React, { useState, useEffect } from 'react';
import { styles } from '../styles'
import { FlatList, Text, Image, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { f, auth, database, storage } from '../config/config.js';

import PhotoList from '../component/photoList';



export default UserProfile = ({navigation, route}) => {
    const [loaded, setLoaded] = useState(false);
    const [user, setUser] = useState({userId : '' });

    useEffect(() => {
        checkParams();
        console.log(user);
    }, []
    )
    
    const checkParams = () => {
        let params = route.params;
        if(params) {
            if(params.userId){
                setUser({...user, userId: params.userId});
                fetchUserInfo(params.userId);
            }
        }
    }

    const fetchUserInfo = userId => {
        console.log(userId)
        database.ref('user').child(userId).child('name').once('value').then(
            snapshot => {
                const exist = (snapshot.val() !== null);
                if(exist) data = snapshot.val();
                setUser({...user, name: data});
            }
        ).catch(error => console.log(error));

        database.ref('user').child(userId).child('username').once('value').then(
            snapshot => {
                const exist = (snapshot.val() !== null);
                if(exist) data = snapshot.val();
                setUser({...user, username: data});
                console.log('username')
            }
        ).catch(error => console.log(error));

        database.ref('user').child(userId).child('avatar').once('value').then(
            snapshot => {
                const exist = (snapshot.val() !== null);
                if(exist) data = snapshot.val();
                setUser({...user, avatar: data});
            }
        ).catch(error => console.log(error));
        setLoaded(true);
    }
    return (
        <View style={styles.container}>
            {
                loaded == true ? (
                    <View style={{flex: 1}}>
                        <View style={{ height: 70, paddingTop: 30, borderBottomWidth: 0.5, borderColor: 'lightgrey', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Text>Go back</Text>
                            </TouchableOpacity>
                            <Text>Profile</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingVertical: 10}}>
                            <Image source={{uri: 'https://api.adorable.io/avatars/285/test@user.i.png'}}
                                style={{marginLeft: 10, width: 100, height: 100, borderRadius: 50, backgroundColor: 'blue'}}
                            />
                            <View style={{marginRight: 10, borderBottomWidth: 0.5, paddingVertical: 20}}>
                                <Text>{user.name}</Text>
                                <Text>{user.username}</Text>
                            </View>
                        </View>
                        {
                            route.params.userId == '' ? (
                                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text>Loading ...</Text>
                                </View>
                            ) : (
                                <PhotoList isUser={true} userId={route.params.userId} navigation={navigation} />
                            )
                        }
                    </View>                   
                    ) : (
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text>Loading...</Text>
                    </View>
                )
            }
        </View>
    )
}