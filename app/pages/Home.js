import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

const MENU_URL = 'http://reactnativewordpress.dev/wp-json/menus/menu';

export default class Home extends React.Component {

    constructor() {
        super();
       
    }

    componentDidMount() {
        this._isMounted = true;
        //this.fetchMenuItems();
    }

    goToPage(page) {
        this.props.navigation.navigate('Posts');
    }

    

    render() {
             
        
        return (
            <View style={styles.container}>
                <View style={styles.card} >
                    <Text>Home Screen</Text>
                </View>
                    <TouchableHighlight onPress={() => this.goToPage('Posts')}>
                        <View style={styles.card}>
                            <Text>Posts</Text>
                        </View>
                    </TouchableHighlight>
            </View>
        )
    }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  card: {
      backgroundColor: '#dedede',
      justifyContent: 'center',
      padding: 30,
      borderStyle: 'solid',
      borderColor: 'black',
      borderWidth: 3,
  }
});