import React, { useState, useEffect } from 'react';
import { styles } from '../styles'
import { FlatList, Text, Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import { f, auth, database, storage } from '../config/config.js';

import PhotoList from '../component/photoList';


export default Feed = ({navigation}) => {

    return (
        <View style={styles.container}>
            <View style={{ height: 70, paddingTop: 30, borderBottomWidth: 0.5, borderColor: 'lightgrey', justifyContent: 'center', alignItems: 'center' }}>
                <Text>Feed</Text>
            </View>

            <PhotoList isUser={false} userId='' navigation={navigation} />


        </View>
    )
}