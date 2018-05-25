import  React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import Posts from './Posts';
import Gallery from './Gallery';
import Categories from './Categories';
import Home from './Home'
import { Icon } from 'react-native-elements';


const App = createBottomTabNavigator({
  Home: {
    name: "Home",
    description: "Home Tab",
    screen: Home,
    navigationOptions: ({navigation}) => ({
      tabBarLabel: "主頁",
      tabBarIcon: ({tintColor}) => (
        <Icon name="ios-home-outline" type='ionicon' color={tintColor} size={iconSize}  />
      ),
    })
  },
  Posts: {
    name: "Novel",
    description: "Posts Tab",
    screen: Posts,
    navigationOptions: ({navigation}) => ({
      tabBarLabel: "小說",
      tabBarIcon: ({tintColor}) => (
        <Icon name="ios-book-outline" type='ionicon' color={tintColor} size={iconSize}  />
      ),
    }),
  },
  Categories: {
    name: "Categories",
    description: "Categories Tab",
    screen: Categories,
    navigationOptions: ({navigation}) => ({
      tabBarLabel: "小說",
      tabBarIcon: ({tintColor}) => (
        <Icon name="ios-book-outline" type='ionicon' color={tintColor} size={iconSize}  />
      ),
    }),
  },
  Gallery: {
    name: "Gallery",
    description: "Gallery Tab",
    screen: Gallery,
    navigationOptions: ({navigation}) => ({
      tabBarLabel: "插圖",
      tabBarIcon: ({tintColor}) => (
        <Icon name="ios-images-outline" type='ionicon' color={tintColor} size={iconSize} />
      ),
    }),
  },
}, {
  tabBarPosition: "bottom",
  initialRouteName: "Categories",
  animationEnabled: true,
  swipeEnabled: true,
  tabBarOptions: {
    showIcon: true,
    
    labelStyle: {
      fontSize: 8,              
      marginTop: 2,
      marginBottom: 1,
    },
    style: {
      backgroundColor: 'white',
      paddingBottom: 2,
    },
    activeTintColor: '#666',
    inactiveTintColor: '#aaa',
    showLabel: false,
  }
}); 

const iconSize = 36;

const styles = StyleSheet.create({
    tabBarIcon: {
       width:12,
       height:12,
    }

});

export default () => (<App />);