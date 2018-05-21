import React from 'react';
import { AppLoading, Font } from 'expo';


export default class AppFontLoader extends React.Component {


  state = {


    fontLoaded: false


  };




  async componentWillMount() {


    try {


      await Font.loadAsync({
     
        'Material Icons': require('../../node_modules/@expo/vector-icons/fonts/MaterialIcons.ttf'),
        'Ionicons': require('../../node_modules/@expo/vector-icons/fonts/Ionicons.ttf'),


      });


      this.setState({ fontLoaded: true });


    } catch (error) {


      console.log('error loading icon fonts', error);


    }


  }




  render() {


    if (!this.state.fontLoaded) {


      return <AppLoading />;


    }




    return this.props.children;


  }


}




export { AppFontLoader };