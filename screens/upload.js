import React, {useState, useEffect} from 'react';
import { styles } from '../styles'
import { FlatList, Text, Image, View, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { f, auth, database, storage } from '../config/config.js';
import * as Permissions from 'expo-permissions'; 
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { set } from 'react-native-reanimated';


export default Upload = () => {
    const [ loggedIn, setLoggedIn] = useState(false);
    const [imageId, setImageId] = useState(null);
    const [cameraRoll, setCameraRoll] = useState(null);
    const [currentFileType, setCurrentFileType] = useState(null);
    const [imageSelected, setImageSelected] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0)
    const [photo_uri, setUri] = useState('')

    useEffect(() => {
        f.auth().onAuthStateChanged(user => {
            if(user){
                setLoggedIn(true);
            } else{
                setLoggedIn(false);
            }
        });
        setImageId(uniqueId())
    }, []
    )

    const _checkPermissions = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        const { statusRoll } = await ImagePicker.requestCameraRollPermissionsAsync();
        setCameraRoll(statusRoll);
    }

    const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    const uniqueId = () => {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4();
    }

    const findNewImage = async () =>{
        _checkPermissions();
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowsEditing: true,
            quality: 1
            });
        console.log(result);
        if(!result.cancelled) {
            console.log('upload photo');
            setImageSelected(true),
            setImageId(uniqueId());
            setUri(result.uri)
            
            // uploadImage(result.uri);
        }else{
            console.log('cancel');
            setImageSelected(false);
        }
    }

    const uploadImage = async (uri) => {
        const userid = f.auth().currentUser.uid;

        var re = /(?:\.([^.]+))?$/;
        const ext = re.exec(uri)[1];
        setUploading(true)

        const response = await fetch(uri);
        const blob = await response.blob();
        const pathFile = imageId+'.'+ext;

        const uploadTask = storage.ref('user/'+userid+'/img').child(pathFile).put(blob);
        uploadTask.on('state_changed', (snapshot) => {
            let progress1 = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
            console.log(progress1);
            setProgress(progress1)
        }, (error) => {
            console.log('error with upload' + error)
        },
            () => {
                setProgress(100);
                uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) =>{
                    processUpload(downloadUrl)
                })
            }
        )      
    }

    const uploadPublish = () => {
            uploadImage(photo_uri);           
    }

    const processUpload = imgUrl => {

        // set needed info
        const userid = f.auth().currentUser.uid;
        const timestamp = Math.floor(Date.now() / 1000);
        
        //build photo object
        const photoObj = {
            author: userid,
            caption: caption,
            posted: timestamp,
            url: imgUrl
        }
        // add to main feed
        database.ref('/photos/'+imageId).set(photoObj)

        // set user photo object
        database.ref('/user/'+userid+'/photos/'+imageId).set(photoObj)

        alert('Image Uploaded')

        setUploading(false);
        setImageSelected(false);
        setCaption('');
        setUri('');
    }

    return (
        <View style={styles.container}>
            {
                loggedIn == true ? (
                    <View style={{flex: 1}}>
                    {
                        imageSelected == true ? (
                            <View style={{flex: 1}}>
                                <View style={{ height: 70, paddingTop: 30, borderBottomWidth: 0.5, borderColor: 'lightgrey', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>Upload</Text>
                                </View>
                                <View style={{padding: 10}}> 
                                    <Text style={{marginTop: 10}}>Caption:</Text>
                                    <View style={{flexDirection: 'row', marginVertical: 10, justifyContent:'space-between'}}>
                                        <Image source={{uri: photo_uri}} style={{height: 100, width: 100 }} resizeMode='cover' />
                                        <TextInput
                                        editable={true}
                                        placeholder={'Enter your caption..'}
                                        maxLength={150}
                                        multiline={true}
                                        numberOfLines={4}
                                        style={{borderColor: 'grey', borderWidth: 1, padding: 5, height: 100, width: 250}}
                                        onChangeText={(text) => setCaption(text)}
                                     />
                                    </View>

                                     <TouchableOpacity
                                        onPress={ () => uploadPublish()}
                                        style={{
                                            alignSelf:'center',
                                            width: 170,
                                            marginHorizontal: 'auto',
                                            backgroundColor: 'orange',
                                            borderRadius: 5,
                                            paddingVertical: 10,
                                            paddingHorizontal: 20
                                        }}
                                     >
                                         <Text>Upload and Publish</Text>
                                     </TouchableOpacity>

                                     {
                                         uploading == true ? (
                                            <View style={{marginTop: 10}}>
                                                <Text>{progress}%</Text>
                                                {
                                                    progress != 100 ? (
                                                        <ActivityIndicator size='small' color= 'blue' />
                                                    ) : (
                                                        <Text>Processing done!</Text>
                                                    )
                                                }
                                            </View>
                                         ): (
                                            <View>
                                            </View>
                                         )
                                     }
                                </View>
                            </View>
                        ) : (
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 28, paddingBottom: 15}}>Upload</Text>
                                <TouchableOpacity style={{paddingHorizontal: 20, paddingVertical: 10, backgroundColor: 'orange', borderRadius: 5}}
                                                onPress={()=>findNewImage()}
                                >
                                    <Text>Select photo</Text>
                                </TouchableOpacity>
                            </View>    
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
