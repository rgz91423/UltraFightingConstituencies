import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import Post from './Post';
import { WordpressService } from '../services/wordpress.service';
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
export default class Posts extends React.Component {

    _keyExtractor = (item, index) => String(item.id);

    

    constructor(categoryId) {
        super();
       // this.itemsRef = undefined;//firebaseApp.database().ref('isUpdated');
        this.state = {
            isLoading: true,
            categoryId: categoryId,
            posts: undefined
        };
    }

    componentWillMount() {
        //this.fetchAllPosts();
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
        this.fetchAllPosts();
    }

    componentWillUnmount() {

    }

    fetchAllPosts() {
        WordpressService.getPosts(this.state.categoryId)
        .then((responseData) => {
            //responseData.forEach()
            this.setState({
                isLoading: false,
                posts: responseData
            })
           
        })
        .done();
    }

    renderPost = ({ item }) => (
        <ListItem
          title={item.title.rendered}
          //subtitle={item.subtitle}
          //leftAvatar={{ source: { uri: item.avatar_url } }}
        />
    )


    render() {
        
        return (
            <View style={styles.container}>
                <Header
                leftComponent={{ icon: 'menu', color: '#fff' }}
                centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
                />
                {
                    (this.state.isLoading==true) ?  (
                        <Text>Loading...</Text>
                    ) : (<FlatList
                            keyExtractor={this._keyExtractor}
                            data={this.state.posts}
                            renderItem={this.renderPost}
                            />
                        )
                }

            </View>
        )
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