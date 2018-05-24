import React from 'react';
import { StyleSheet, Text, View, WebView, FlatList, Image, Dimensions } from 'react-native';
import Post from './Post';
import { WordpressService } from '../services/wordpress.service';
import * as Config from '../config/config';
import { Header, ListItem } from 'react-native-elements';

import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
// Initialize Firebase
/*
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
  };
const firebaseApp = firebase.initializeApp(firebaseConfig);
*/
const WIDTH = Dimensions.get('window').width;

export default class Categories extends React.Component {

    _keyExtractor = (item, index) => String(item.id);

    constructor(categoryId=Config.GALLERY_CATEGORY_ID) {
        super();
        this.itemsRef = undefined;//firebaseApp.database().ref('isUpdated');
        this.mounted = true;
        this.state = {
            isLoading: true,
            categoryId: categoryId
        };
    }

    componentWillMount() {
        /*
        this.itemsRef.on('value', (item) => {
            
            console.log(item);
            console.log(typeof item.val());
            if (item.val() === true) {
                console.log("Updating Value");
                this.state = {
                    isLoading: true,
                }
                this.fetchAllPosts();
            } else {
                console.log("No Update Needed");
            }
            
        });*/
    }

    componentDidMount() {
        this.state = {
            isLoading: true
        };
        this.fetchAllCategorues();
    }

    fetchAllCategorues() {
        WordpressService.getCategories(4)
        .then((responseData) => {
            this.setState({
                isLoading: false,
                categories: responseData
            })
        })
        .done();
    }

    getThumbnail(category) {
        try {
          return category.img_thumbnail; 
        } catch (e) {
          return undefined;
        }
      }

    renderPost = ({ item }) => (
            
            <ListItem
                title={item.name}
                subtitle={item.count+"篇"}
                avatar={{
                    size:"large",
                    source: item.img_thumbnail && { uri: item.img_thumbnail }
                }}
            />  
    )


    render() {
        const isLoading = this.state.isLoading;

        if (isLoading) {
            return (
            <View style={styles.container}>
                <Header
                    leftComponent={{ icon: 'menu', color: '#fff' }}
                    centerComponent={{ text: '小說連載', style: { color: '#fff' } }}
                    />
                <Text>Loading...</Text>
            </View>
            )
        } else {
            
            return (
                <View style={styles.container}>
                    <Header
                        leftComponent={{ icon: 'menu', color: '#fff' }}
                        centerComponent={{ text: '小說連載', style: { color: '#fff' } }}
                        />
                
                        
                        <FlatList
                        keyExtractor={this._keyExtractor}
                        data={this.state.categories}
                        renderItem={this.renderPost}
                        />
                        
                </View>
                
            )
        }
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  card: {
      backgroundColor: '#fff',
      padding: 20,
      marginTop: 0,
      borderStyle: 'solid',
      borderColor: '#ccc',
      borderWidth: 1,
      fontSize:20
  }
});