import React from 'react';
import { StyleSheet, Text, View, ScrollView, WebView, FlatList, Modal, TouchableHighlight, ActivityIndicator } from 'react-native';
import Post from './Post';
import { WordpressService } from '../services/wordpress.service';
import { Header, ListItem, Badge } from 'react-native-elements';
import HTMLView from 'react-native-htmlview';
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
export default class Posts extends React.Component {

    _keyExtractor = (item, index) => "post_"+item.id;

    

    constructor() {
        super();
       // this.itemsRef = undefined;//firebaseApp.database().ref('isUpdated');
       
        this.state = {
            isLoading: true,
            category: undefined,
            posts: undefined,
            modalVisible: false,
            showIndex: 0
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
       
        const { navigation } = this.props;
        const categoryId = navigation.getParam('categoryId', 'NO-ID');

        this.state = {
            isLoading: true,
            modalVisible: false,
            showIndex: 0
        };
      
        this.fetchAll(categoryId);
    }

    componentWillUnmount() {

    }

    postTapped(index) {
         
        this.setState({
            showIndex:index,modalVisible: true
        });

        let post = this.state.posts[index];

        if(!post || !post.detailed){
            
            WordpressService.getPost(post.id)
            .then(data => {
                post = data;
                post.detailed=true;
                
                //loading.dismiss();
                this.getCategories(post).then(cats=>{
                    post.categories = cats;
                    let tmpPosts = this.state.posts;
                    tmpPosts[index] = post;
                    this.setState({posts: tmpPosts});
                    console.log("returned:" + post.content.rendered);

                });
                
                
            });
          }
      

    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    goBack() {
        this.props.navigation.goBack();
    }


    getAuthorData(post){
        return WordpressService.getAuthor(post.author);
    }

    getCategories(post){
        return WordpressService.getPostCategories(post.id);
    }

    getComments(post){
        return WordpressService.getComments(post.id);
    }

    fetchAll(categoryId) {
        this.fetchCategory(categoryId).then(category=>{
            this.setState({
                category: category
            });
            this.fetchAllPosts(categoryId).then(posts=>{
                this.setState({
                    isLoading:false,
                    posts: posts
                });
            }).done();
        }).done();
    }

    fetchCategory(categoryId) {
   
        return WordpressService.getCategory(categoryId);
    }

    fetchAllPosts(categoryId) {
        return WordpressService.getPosts(categoryId);
    }

    renderPost = ({ item, index }) => (
        <ListItem
          title={item.title.rendered}
          //subtitle={item.subtitle}
          //leftAvatar={{ source: { uri: item.avatar_url } }}
            onPress={() =>  this.postTapped(index)}
            
        />
    )

    


    render() {

        return (
            <View style={styles.container}>
                <Header
                leftComponent={{ icon: 'chevron-left', color: '#fff', onPress: () => this.props.navigation.goBack() }}
                centerComponent={{ text: (this.state.isLoading ? '' : this.state.category.name), style: { color: '#fff' } }}
                />
                {
                    (this.state.isLoading==true) ?  (
                        <View style={[styles.container,styles.horizontal]}>
                            <ActivityIndicator size="large" />
                        </View>
                    ) : (<View><FlatList
                            keyExtractor={this._keyExtractor}
                            data={this.state.posts}
                            renderItem={this.renderPost}
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
                            rightComponent={{ icon: 'close', style: { color: '#fff' }, onPress: () => this.setModalVisible(false) }}
                            />

                            <Swiper 
                            loop={false}
                            showsPagination={false}
                            index={this.state.showIndex}
                            onIndexChanged={(index)=>this.postTapped(index)}
                            >
                            {
                                this.state.posts.map((item, i) => (
                                //<ScrollView title={<Text numberOfLines={1}>{item.title.rendered}</Text>}>
                                 //   <Text>{item.title.rendered}</Text>
                                 //   <Text>{(item.content && item.content.rendered) ? item.content.rendered: ''}</Text>
                                //</ScrollView>
                               
                                    (item.content && item.content.rendered) ?
                                    (
                                        <ScrollView style={styles.container}>
                                        {
                                        item.categories.map((category, i) => (
                                            <Badge value={category.name} />
                                        ))   
                                        }
                                        <Text>{item.title.rendered}</Text>
                                        <HTMLView 
                                        styleSheet={styles.htmlstyles}
                                        title={item.title.rendered} 
                                        value={item.content.rendered}
                                        />
                                        </ScrollView>
                                    ) : (
                                        <View style={[styles.container,styles.horizontal]}>
                                        <ActivityIndicator size="large" />
                                        </View>
                                    )
                               

                                ))
                            }
                            </Swiper>
                               
                            </View>
                          </Modal>
                          </View>
                        )
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
 
  
});
var fontSize=18;
var htmlstyles =StyleSheet.create({
    a: {
            fontWeight: '300',
            fontSize:fontSize
    },
p:{
    fontSize:fontSize,
    marginBottom:10,
},
strong:{
    fontWeight:'bold',
    fontSize:fontSize
},
li:{
    fontSize:fontSize,
}
})