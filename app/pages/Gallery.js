import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, Dimensions, Modal, TouchableHighlight } from 'react-native';
import Post from './Post';
import { WordpressService } from '../services/wordpress.service';
import * as Config from '../config/config';
import { Header } from 'react-native-elements';

import Swiper from 'react-native-swiper';
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

export default class Gallery extends React.Component {

    _keyExtractor = (item, index) => "gallery_"+item.id;
    _keyExtractorDetail = (item, index) => "gallery_detail_"+item.id;

    constructor(categoryId=Config.GALLERY_CATEGORY_ID) {
        super();
        //this.itemsRef = undefined;//firebaseApp.database().ref('isUpdated');
        this.state = {
            isLoading: true,
            categoryId: categoryId,
            posts: undefined,
            modalVisible: false
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

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    componentDidMount() {
        this.state = {
            isLoading: true,
            modalVisible: false
        };
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

    renderPost =  ({ item })  => {

        var imgUrl=this.getThumbnail(item);

        return (
            <TouchableHighlight style={styles.button} onPress={() =>  this.setModalVisible(!this.state.modalVisible)}>
                <Image
                source={imgUrl && { uri: imgUrl }}
                style={styles.image}
                />
            </TouchableHighlight>
        )
           
    }


    render() {
        const isLoading = this.state.isLoading;
        return (
            <View style={styles.container}>
                <Header
                centerComponent={{ text: '插圖', style: { color: '#fff' } }}
                />
                {
                    (this.state.isLoading==true) ?  (
                        <Text>Loading...</Text>
                    ) : (
                            <View>
                                <FlatList
                            numColumns={3}
                            keyExtractor={this._keyExtractor}
                            data={this.state.posts}
                            renderItem={this.renderPost}
                            onEndReached={this.doInfinite}
                            onEndReachedThreshold={0.5}
                            />
                            
                            <Modal
                            animationType="slide" 
                            transparent={false}
                            visible={this.state.modalVisible}
                            onRequestClose={() => {
                              alert('Modal has been closed.');
                            }}>
                            <View style={styles.container}>
                            <Header
                            rightComponent={{ icon: 'close', style: { color: '#fff' }, onPress: () => this.setModalVisible(!this.state.modalVisible) }}
                            />

                            <Swiper showsButtons={true}>
                            {
                                this.state.posts.map((item, i) => (
                                <View >
                                    <Text>{item.content.rendered}</Text>
                                </View>
                                ))
                            }
                            </Swiper>
                             
                  
                                <TouchableHighlight style={styles.button}
                                  onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                  }}>
                                  <Text>Hide Modal</Text>
                                </TouchableHighlight>
                             
                            </View>
                          </Modal>
                          </View>

                            
                        )
                }

            </View>
        );
    }


    doInfinite = () => {
       // try {
            let page = (Math.ceil(this.state.posts.length/Config.QUERY_SIZE_GALLERY)) + 1;
        
            WordpressService.getGallery(5, page)
            .then(data => {
                console.log('onEndReached()', this.state.posts)
                let curData = this.state.posts
                let newData = curData.concat(data);
                this.setState({posts: newData})
            }).done();
       // } catch (e) {}
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
  button: {
    flex:2,
  },
  image: {
    height: WIDTH /3,
    margin: 1,
    flex:1,
  }
});
