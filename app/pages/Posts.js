import React from 'react';
import { StyleSheet, Text, View, ScrollView, WebView, FlatList, Modal, TouchableHighlight, ActivityIndicator } from 'react-native';
import Post from './Post';
import { WordpressService } from '../services/wordpress.service';
//import { Header } from 'react-native-elements';
import { Container, Header, Content, Button, List, ListItem,Left, Body, Right,Title } from 'native-base';
import Swiper from 'react-native-swiper';
import HTML from 'react-native-render-html';
import { Icon } from 'react-native-elements';
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
        
        var categoryId = this.props.navigation.getParam('categoryId', 'NO-ID');

        this.fetchAll(categoryId);
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

    fetchAll(categoryId) {
        console.log("fetch all " + categoryId);
        
        this.setState({
            isLoading: true,
            modalVisible: false,
            showIndex: 0
        });
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

    renderPost(item, index) {
        return (
        <ListItem
          style={{ padding:14}}
          //subtitle={item.subtitle}
          //leftAvatar={{ source: { uri: item.avatar_url } }}
            onPress={() =>  this.postTapped(index)}>
            <Left><Text>{item.title.rendered}</Text></Left>
            <Right>
                <Icon name="arrow-forward" />
            </Right>
        </ListItem>)
    }

    renderLoading() {
        return (<View style={[styles.container,styles.horizontal]}>
            <ActivityIndicator size="large" />
        </View>)
    }
    
    renderList(){
        return (<List >
                {
                    this.state.posts.map((item, i) => (
                      this.renderPost(item,i)
                    ))
                  }
                </List>)
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
            
            <Header>
                <Left/>
                <Body>
                    <Title>{this.state.posts[this.state.showIndex].title.rendered}</Title>
                </Body>
                <Right>
                    <Button transparent onPress={ () => this.setModalVisible(false)}>
                    <Icon name='close' />
                    </Button>
                </Right>
            </Header>

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
                        
                        
                        <Container style={styles.container}>
                            <Content style={{padding:10}} >
                                <View style={{flexDirection: "row"}}>
                                {
                                item.categories.map((category, i) => (
                                    <Button style={styles.badgeButton} small warning rounded><Text>{category.name}</Text></Button>
                                ))   
                                }
                                </View>
                            
                             <HTML baseFontStyle={{fontSize:18}} html={item.content.rendered} />
                            </Content>
                         </Container>
                      
                       
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
        console.log(nextProps);
        //this.setState({
        //  latitude: nextProps.latitude,
        //});
        var categoryId = nextProps.navigation.getParam('categoryId', 'NO-ID');
       
        this.fetchAll(categoryId);
    }


    render() {

        console.log("render");

        return (
            <Container>
                 <Header>
                    <Left>
                        <Button transparent onPress={ () => this.props.navigation.goBack()}>
                        <Icon name='left' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>{(this.state.isLoading ? '' : this.state.category.name)}</Title>
                    </Body>
                    <Right/>
                </Header>
                
                {
                    (this.state.isLoading==true) ?  
                        this.renderLoading()
                     : (<Content>
                        { this.renderList() }
                        { this.renderModal() }
                        </Content>
                        )
                }

            </Container>
        )
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
  badgeButton: {
      paddingLeft:10,paddingRight:10,margin:3
  }
 
  
});
var fontSize=48;
var htmlstyles =StyleSheet.create({
    a: {
            fontWeight: '300',
            fontSize:fontSize
    },
p: {
    fontSize:fontSize,
    marginBottom:0
},
div: {
    fontSize:fontSize,
    marginBottom:0,
},
strong:{
    fontWeight:'bold',
    fontSize:fontSize
},
li:{
    fontSize:fontSize,
}
})