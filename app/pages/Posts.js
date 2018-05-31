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

    

    constructor(props) {
        console.log("coinstruct");
        super(props);
       // this.itemsRef = undefined;//firebaseApp.database().ref('isUpdated');
       
        this.state = {
            isLoading: true,
            categoryId: undefined,
            posts: undefined,
            modalVisible: false,
            showIndex: 0
        };
        this.fetchAll = this.fetchAll.bind(this);
    }

    componentWillMount() {
        console.log("will mount");
       
    }

    componentDidMount() {
        console.log("did mount");
        
      
        this.fetchAll();
    }

    componentWillUnmount() {
        console.log("will unmount");
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

    fetchAll() {
        
        var categoryId = this.props.navigation.getParam('categoryId', 'NO-ID');
        console.log("fetch all " + categoryId);

        this.setState({
            categoryId: categoryId,
            isLoading: true,
            modalVisible: false,
            showIndex: 0
        });
        this.fetchCategory(categoryId).then(category=>{
            this.setState({
                category: category,
                categoryId: category.id
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

    renderLoading() {
        return (<View style={[styles.container,styles.horizontal]}>
            <ActivityIndicator size="large" />
        </View>)
    }
    
    renderList(){
        return (<FlatList
                keyExtractor={this._keyExtractor}
                data={this.state.posts}
                renderItem={this.renderPost}
                />)
    }

    renderModal() {
    return (
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
                        stylesheet={styles.htmlstyles}
                        title={item.title.rendered} 
                        value={item.content.rendered}
                        />
                        </ScrollView>
                    ) : 
                        this.renderLoading()

                ))
            }
            </Swiper>
                
            </View>
            </Modal>)
    }

    componentWillReceiveProps(nextProps) {
        // update original states
        console.log("update " + nextProps.categoryId);
        //this.setState({
        //  latitude: nextProps.latitude,
        //});
        this.fetchAll();
    }


    render() {

        console.log("render");

        return (
            <View style={styles.container}>
                <Header
                leftComponent={{ icon: 'chevron-left', color: '#fff', onPress: () => this.props.navigation.goBack() }}
                centerComponent={{ text: (this.state.isLoading ? '' : this.state.category.name+ "-"+ this.state.categoryId), style: { color: '#fff' } }}
                />
                {
                    (this.state.isLoading==true) ?  
                        this.renderLoading()
                     : (<View>
                        { this.renderList() }
                        { this.renderModal() }
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
p: {
    fontSize:fontSize,
},
div: {
    fontSize:fontSize,
    marginBottom:5,
},
strong:{
    fontWeight:'bold',
    fontSize:fontSize
},
li:{
    fontSize:fontSize,
}
})