import React, {useState, useEffect} from 'react';
import { styles } from '../styles'
import { FlatList, Text, Image, View, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
import { f, auth, database, storage } from '../config/config.js';


export default Comments = ({ navigation, route}) => {
    const [ loggedIn, setLoggedIn] = useState(false);
    const [ photoObj, setPhotoObj] = useState({});
    const [ comments_list, setComments_list ] = useState([])
    const [ loading, setLoading] = useState(true);
    const [ refresh, setRefresh] = useState(true);

    useEffect(() => {
        checkParam();
        f.auth().onAuthStateChanged(user => {
            if(user){
                setLoggedIn(true);
            } else{
                setLoggedIn(false);
            }
        })
    }, []
    );

    const checkParam = () => {
        let params = route.params;
        if(params) {
            if(params.photoId){
                setPhotoObj({...photoObj, photoId: params.photoId});
                fetchComments(params.photoId);
            }
        }
    }

    const addCommentToList = (comment_list, data, comment) => {
        console.log(comment_list, data, comment);
        let commentObj = data[comment];
        database.ref('user').child(commentObj.author).child('username').once('value').then(
            snapshot => {
                const exist = (snapshot.val() !== null);
                
                comment_list.push({
                    id: comment,
                    comment: commentObj.comment,
                    posted: timeConverter(commentObj.posted),
                    author: data,
                    authorId: commentObj.author
                })

                setRefresh(false);
                setLoading(false);
            }
        ).catch(error => console.log(errors))
    }

    const fetchComments = photoId => {
        database.ref('comments').child(photoId).orderByChild('posted').once('value').then((snapshot) => {
            const exist = (snapshot.val() !== null);
            if(exist){
                const data = snapshot.val();
                let comments_lisT = comments_list;

                for(var comment in data){
                    addCommentToList(comments_lisT, data, comment);
                }
            }else{
                setComments_list([])
            }
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

    const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    const uniqueId = () => {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4();
    }

    return (
        <View style={styles.container}>
            {
                loggedIn == true ? (
                    <View style= {{flex: 1}}>
                    <View style={{ height: 70, paddingTop: 30, borderBottomWidth: 0.5, borderColor: 'lightgrey', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text>Go back</Text>
                        </TouchableOpacity>
                        <Text>Comments</Text>
                    </View>
                    {
                        comments_list.length == 0 ? (
                            <View><Text>NO comments found</Text></View>
                        ) : (
                            <FlatList 
                                refreshing={refresh}
                                data={comments_list}
                                keyExtractor={(item, index) => index.toString()}
                                style={{flex: 1, backgroundColor: '#eee'}}
                                renderItem={({item, index}) => (
                                    <View key={index.toString()} style={{width: '100%', overflow: 'hidden', marginBottom: 5, justifyContent: 'center', borderBottomColor: 'grey', borderBottomWidth: 0.5}}>
                                        <Text>{item.posted}</Text>
                                    </View>
                                )}
                            />
                         )
                    }
                    </View>

                     ) : (
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text>You are not logged in.</Text>
                        <Text>Please login to upload photo</Text>
                    </View>
                )
            }        
        </View>
    )
}
