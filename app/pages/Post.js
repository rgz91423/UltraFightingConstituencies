import React from 'react';
import { Text, View } from 'react-native';


export default Post = function(props) {
    
        return (
            <View>
                <Text>{props.title}</Text>
                <Text>{props.content}</Text>
            </View>
        )
    
};