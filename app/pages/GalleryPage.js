import React from 'react';
import { StyleSheet, Text, View, WebView, ScrollView, FlatList, Image, Dimensions } from 'react-native';
import Post from './Post';
import { WordpressService } from '../services/wordpress.service';
import * as Config from '../config/config';
import { Header } from 'react-native-elements';
import GridView from 'react-native-super-grid';


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

export default class GalleryPage extends React.Component {

    _keyExtractor = (item, index) => item.id;

    constructor(categoryId=Config.GALLERY_CATEGORY_ID) {
        super();
        this.itemsRef = undefined;//firebaseApp.database().ref('isUpdated');
        this.state = {
            isLoading: true,
            categoryId: categoryId
        };
    }

    componentWillMount() {
        this.state = {
            isLoading: true,
        }
        this.fetchAllPosts();
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
        this.fetchAllPosts();
    }

    fetchAllPosts() {
        WordpressService.getGallery(5)
        .then((responseData) => {
            this.setState({
                isLoading: false,
                posts: responseData
            })
        })
        .done();
    }

    getThumbnail(item) {
        try {
          return item.better_featured_image.media_details.sizes.thumbnail.source_url; 
        } catch (e) {
          return undefined;
        }
      }

    renderPost =  item  => {

        var imgUrl=this.getThumbnail(item);

        return (<Image
            animation={'bounceIn'}
            duration={500}
            source={{uri: imgUrl}}
            style={styles.image}
        />)
           
    }


    render() {
        const isLoading = this.state.isLoading;

        if (isLoading) {
            return (
            <View style={styles.container}>
                <Header
                    leftComponent={{ icon: 'menu', color: '#fff' }}
                    centerComponent={{ text: '插圖', style: { color: '#fff' } }}
                    />
                <Text>Loading...</Text>
            </View>
            )
        } else {
            const images = this.state.posts.map((post) => ({
                url: this.getThumbnail(post),
                id: post.id,
                title: post.title.rendered,
                description: post.content.rendered
              })
            );
            return (
                <View style={styles.container}>
                    <Header
                        leftComponent={{ icon: 'menu', color: '#fff' }}
                        centerComponent={{ text: '插圖', style: { color: '#fff' } }}
                        />
                        <GridView
                        itemDimension={styles.image}
                        spacing={0}
                        items={this.state.posts}
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
  },
  GridViewBlockStyle: {
 
    justifyContent: 'center',
    flex:1,
    alignItems: 'center',
    width: WIDTH / 3,
    height: WIDTH /3,
    margin: 5,
    backgroundColor: '#00BCD4'
   
  }, 
  image: {
    height: WIDTH /3,
    margin: 0,
    flex:1,
  }
});
