import React from 'react';
import { StyleSheet, View, FlatList, Modal, TouchableHighlight, ActivityIndicator } from 'react-native';
import Post from './Post';
import { WordpressService } from '../services/wordpress.service';
//import { Header } from 'react-native-elements';
import { Container, Text, Header, Content, Button, List, ListItem,Left, Body, Right,Title, Icon, DeckSwiper, Footer, FooterTab } from 'native-base';
import Swiper from 'react-native-swiper';
import HTML from 'react-native-render-html';
//import { Icon } from 'react-native-elements';
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

        if(!post.detailed){
            
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
        <ListItem noIndent key={"pos_"+item.id}
          
          //subtitle={item.subtitle}
          //leftAvatar={{ source: { uri: item.avatar_url } }}
            onPress={() =>  this.postTapped(index)}>
            <Left><Text style={{fontSize:20,padding:8}}>{item.title.rendered}</Text></Left>
            <Right>
                <Icon name="arrow-forward" />
            </Right>
        </ListItem>)
    }

    renderLoading(item=undefined) {
        return (<View key={item? "loading_post_"+item.id : ''} style={[styles.container,styles.horizontal]}>
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



            <Swiper ref="mySwipe"
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
            </Modal>)
    }

    swipe(index){
        var mySwipe = this.refs.mySwipe;
        mySwipe.scrollBy(index);
    }



    renderModalDetail(item){
        console.log("item");
        console.log(item);
        return (item.content && item.content.rendered) ?
        (
            
            <Container key={"pos_detail_"+item.id} style={styles.container}>
                <Content style={{padding:10}} >
                    <View style={{flexDirection: "row"}}>
                    {
                    item.categories.map((category, i) => (
                        <Button key={"post_category_" + item.id + "_" + category.id} style={styles.badgeButton} small warning rounded><Text>{category.name}</Text></Button>
                    ))   
                    }
                    </View>
                
                 <HTML baseFontStyle={{fontSize:20}} html={item.content.rendered} />
                </Content>
             </Container>
          
           
        ) : this.renderLoading(item)
        
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
                        <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body style={{flex: 2}}>
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