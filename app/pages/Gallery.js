import React from 'react';
import { StyleSheet, View, FlatList, Image, Dimensions, Modal, TouchableHighlight, ActivityIndicator } from 'react-native';
import Post from './Post';
import { WordpressService } from '../services/wordpress.service';
import * as Config from '../config/config';


import Swiper from 'react-native-swiper';
import { Container, Header, Content, Button, List, ListItem,Left, Body, Right,Title, Icon, Thumbnail, Text, DeckSwiper, Footer, FooterTab } from 'native-base';

import ProImage from 'pro-image';
import HTML from 'react-native-render-html';
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
const HEIGHT = Dimensions.get('window').height;

export default class Gallery extends React.Component {

    _keyExtractor = (item, index) => "galleryx_"+item.id;
    _keyExtractorDetail = (item, index) => "gallery_detail_"+item.id;

    constructor(categoryId=Config.GALLERY_CATEGORY_ID) {
        super();
        //this.itemsRef = undefined;//firebaseApp.database().ref('isUpdated');
        this.state = {
            isLoading: true,
            categoryId: categoryId,
            posts: undefined,
            modalVisible: false,
            showIndex: 0
        };
        this.fetchAllPosts = this.fetchAllPosts.bind(this);
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

      getMediumImage(item) {
        try {
          return item.better_featured_image.media_details.sizes.medium.source_url; 
        } catch (e) {
          return undefined;
        }
      }


      getFullImage(item) {
        try {
          return item.better_featured_image.media_details.sizes.large.source_url; 
        } catch (e) {
          return undefined;
        }
      }


    renderLoading(item=undefined) {
        return (<View key={item? "loading_post_"+item.id : ''} style={[styles.container,styles.horizontal]}>
            <ActivityIndicator size="large" />
        </View>)
    }

    renderPost(item,index)  {

        var imgUrl=this.getThumbnail(item);
        console.log("thumbnail: "+item);

        return (
            <TouchableHighlight style={styles.button} onPress={() =>  this.postTapped(index)}>
            <Image style={styles.image} source={imgUrl && { uri: imgUrl }} />
            </TouchableHighlight>
        )
           
    }

    renderList(){
        return (<FlatList
        numColumns={3}
        keyExtractor={this._keyExtractor}
        data={this.state.posts}
        renderItem={ ({ item, index })  => this.renderPost(item,index)}
        />)
    }


    render() {
        const isLoading = this.state.isLoading;
        return (
            <Container>
                <Header>
                    <Body style={{flex: 2}}>
                        <Title>插圖</Title>
                    </Body>
                </Header>
                {
                    (this.state.isLoading==true) ?  (
                        this.renderLoading()
                    ) : (
                           <Content>
                                {this.renderList()}
                                {this.renderModal()}
                          </Content>
                            
                        )
                }

            </Container>
        );
    }


    renderModal(){
        return (
            <Modal
            animationType="slide" 
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              alert('Modal has been closed.');
            }}>
            <Container>
             <Header>
             <Left>
                <Button transparent onPress={ () => this.setModalVisible(false)}>
                <Icon name='arrow-back' />
                </Button>
            </Left>
                <Body style={{flex: 2}}>
                    <Title>{this.state.posts[this.state.showIndex].title.rendered}</Title>
                </Body>
                <Right/>
            </Header>


            <Swiper  ref="mySwipe" showsButtons={false} loadMinimal={true} loadMinimalSize={1}
            loop={false}
            showsPagination={false}
            index={this.state.showIndex}
            onIndexChanged={(index)=>this.postTapped(index)}
            >
            {
                this.state.posts.map((item, i) => (
                    this.renderModalDetail(item)
                ))
            }
            </Swiper>
             
            <Footer>
                <FooterTab>
                    <Left><Button transparent onPress={ () => this.swipe(-1)}>
                    <Icon type="Entypo" name="triangle-left" />
                    </Button></Left>
                    <Right><Button transparent>
                    <Icon type="Entypo" name="triangle-right" onPress={ () => this.swipe(1)}/>
                    </Button></Right>
                </FooterTab>
            </Footer>
                
             
            </Container>
          </Modal>
        )
    }

    renderModalDetail(item){
        console.log("item");
        
        return (item.content && item.content.rendered) ?
        (
            
            <Content style={styles.slide} key={"gallery_detail_"+item.id}>
                    <ProImage 
                        thumbnail={{ uri: this.getMediumImage(item) }} 
                        image={{ uri: this.getFullImage(item) }} 
                        style={styles.imageFull} 
                        resizeMode="cover"
                    >
                    </ProImage>
                 <HTML containerStyle={styles.galleryText} baseFontStyle={{fontSize:16}} tagsStyles={htmlstyles} html={item.content.rendered} />
            </Content>
          
           
        ) : this.renderLoading(item)
        
    }

    swipe(index){
        var mySwipe = this.refs.mySwipe;
        mySwipe.scrollBy(index);
    }


   

    postTapped(index) {
         
        this.setState({
            showIndex:index,modalVisible: true
        });

        let post = this.state.posts[index];

        if(!post.detailed){
            
            WordpressService.getPost(post.id)
            .then(data => {
                post = data;
                post.detailed=true;
                
                let tmpPosts = this.state.posts;
                tmpPosts[index] = post;
                this.setState({posts: tmpPosts});
                
                
            });
          }
      

    }


  
    
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
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
    width: WIDTH / 3,
    height: WIDTH / 3,
    margin: 1,
    flex:1,
  },
  imageFull: {
     width: WIDTH,
     height: HEIGHT,
  },
  slide: {
    flex: 1,
   
    backgroundColor: 'transparent',
    
  },
  galleryText: {
      //zIndex:5,position:'absolute',
      //justifyContent: 'center',
      //opacity:.6,
      flex:1,
  }
});


var htmlstyles ={
  
    p: {
        marginBottom:20,
        lineHeight:20
    },
    div: {
        marginBottom:20,
        lineHeight:20
    }
    
};