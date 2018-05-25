import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import Post from './Post';
import { WordpressService } from '../services/wordpress.service';
import { Header, ListItem } from 'react-native-elements';


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

    

    constructor() {
        super();
       // this.itemsRef = undefined;//firebaseApp.database().ref('isUpdated');
       
        this.state = {
            isLoading: true,
            category: undefined,
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
       
        const { navigation } = this.props;
        const categoryId = navigation.getParam('categoryId', 'NO-ID');

        this.state = {
            isLoading: true,
        };
      
        this.fetchAll(categoryId);
    }

    componentWillUnmount() {

    }

    goBack() {
        this.props.navigation.goBack();
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
                leftComponent={{ icon: 'chevron-left', color: '#fff', onPress: () => this.props.navigation.goBack() }}
                centerComponent={{ text: (this.state.isLoading ? '' : this.state.category.name), style: { color: '#fff' } }}
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