import React, { useState, useEffect } from 'react';
import { styles } from '../styles'

import { FlatList, Text, Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import { f, auth, database, storage } from '../config/config.js'; 


export default PhotoList = ({ isUser, userId, navigation }) => {
    const [ photo_feed, setPhotoFeed ] =  useState([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(true);

    let photoArr = [];

    useEffect(() => {

        if(isUser) {
            console.log(userId)
            loadFeed(userId);
        } else {
            loadFeed('');
        }

    }, []);

    const loadFeed = (userid = '') => {
        setRefresh(true);
        setPhotoFeed([]);

        let loadRef = database.ref('photos');
        if(userId != '') {
            loadRef = database.ref('user').child(userid).child('photos');
        }

        loadRef.orderByChild('posted').once('value').then(
            (snapshot) => {
                const exist = (snapshot.val() != null);
                
                if(exist) data = snapshot.val();
                for( const photo in data ) {
                    addToFlatList(photo_feed, data, photo);
                }
                setPhotoFeed(photoArr);
                }
        ).catch(error => console.log(error))
        photoArr = [];
    }

    const loadNew = () => {
        loadFeed(userId)
    }

    const addToFlatList = (photo_feed, data, photo) => {
        const photoObj = data[photo];
        database.ref('user').child(photoObj.author).child('username').once('value').then(
            (snapshot) => {
                const exist = (snapshot.val() != null);
                if(exist) data = snapshot.val();
                photoArr.push(
                    {
                        id: photo,
                        url: photoObj.url,
                        caption: photoObj.caption,
                        posted: timeConverter(photoObj.posted) ,
                        author: data,
                        authorId: photoObj.author
                    }
                );
                setLoading(false);
                setRefresh(false);
            }).catch(error => console.log(error))
    }

    const pluralCheck = (x) => {
        if(x==1) {
            return ' ago';
        } else {
            return 's ago';
        }
    }

    const timeConverter = timestamp => {
        const a = new Date(timestamp * 1000);
        const seconds = Math.floor((new Date() - a) / 1000);

        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
            return interval + ' year' + pluralCheck(interval);
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + ' month' + pluralCheck(interval);
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + ' day' + pluralCheck(interval);
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + ' hour' + pluralCheck(interval);
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + ' minutes' + pluralCheck(interval);
        }
        return Math.floor(seconds) + ' second' + pluralCheck(seconds);
    }

    return (
        <View style={styles.container}>
            {
                loading == true ? (
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text>Loading...</Text>
                    </View>
                ) : (
                    <FlatList 
                    refreshing={refresh}
                    onRefresh={loadNew}
                    data={photo_feed}
                    keyExtractor={(item, index) => index.toString()}
                    style={{flex: 1}}
                    renderItem={
                        ({item, index}) => (
                            <View key={index} style={{overflow: 'hidden', marginBottom: 10, justifyContent: 'space-between', borderBottomWidth: 0.5, borderBottomColor: 'grey'}}>
                            <View style={{padding: 5, width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text>{item.posted}</Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('User', {userId: item.authorId}) }
                                >
                                    <Text>{item.author}</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Image 
                                    source={{uri: item.url}}
                                    style={{resizeMode: 'cover', width: '100%', height: 250}}
                                />
                            </View>
                            <View style={{padding: 5}}>
                                <Text>{item.caption}</Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Comments', {photoId: item.id}) }
                                >
                                    <Text style={{marginTop: 10, textAlign: 'center', color: 'blue'}}>[ View more Comments ]</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        )
                    }
                />  
                )
            }


        </View>
    )
}