import React from 'react';
import { StyleSheet, View, FlatList, Image, Dimensions, ActivityIndicator } from 'react-native';
import Post from './Post';
import { WordpressService } from '../services/wordpress.service';
import * as Config from '../config/config';
import { Container, Header, Content, Button, List, ListItem,Left, Body, Right,Title, Icon, Thumbnail, Text } from 'native-base';


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

    _keyExtractor = (item, index) => "category_"+item.id;

    constructor(categoryId=Config.GALLERY_CATEGORY_ID) {
        super();
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

    goToPage(item) {
        this.props.navigation.navigate('Posts',{categoryId: item.id});
    }


    renderPost(item ,index) {
            
        return (<ListItem key={"category_"+ item.id} style={{margin:0,padding:0}} noIndent onPress={() => this.goToPage(item)}>
            {
            item.img_thumbnail ?  (
            <Thumbnail square style={{marginTop:-10,marginLeft:-16,marginBottom:-10,marginRight:-10,width:128,height:128}} source={item.img_thumbnail && {uri: item.img_thumbnail}} />)
            : ("")
            }
            <Body style={{marginLeft:10}}>
                <Text style={{fontSize:18}}>{item.name}</Text>
                <Text note>{item.count+"篇"}</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
            </Right>
        </ListItem>
         )
    }

    renderList(){
        return (<List >
                {
                    this.state.categories.map((item, i) => (
                      this.renderPost(item,i)
                    ))
                  }
                </List>)
    }


    render() {
        const isLoading = this.state.isLoading;

            return (
                <Container>
                    <Header>
                        <Body>
                            <Title>小說連載</Title>
                        </Body>
                    </Header>
                        {
                        isLoading ? (
                            <View style={[styles.container,styles.horizontal]}>
                                <ActivityIndicator size="large" />
                            </View>
                        ):(   
                            <Content>
                                { this.renderList() }
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