import  React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import Posts from './Posts';
import Gallery from './Gallery';
import Categories from './Categories';
import Home from './Home'
import { Icon } from 'native-base';


const HomeStack = createStackNavigator({
  Home:  Home
},{headerMode: "none"});

const NovelStack =  createStackNavigator({
  Categories:  Categories,
  Posts: Posts,

},{headerMode: "none"});

const GalleryStack = createStackNavigator({
  Gallery:  Gallery
},{headerMode: "none"});


const App = createBottomTabNavigator({
  
  Home: {
    name: "Home",
    description: "Home Tab",
    screen: HomeStack,
    navigationOptions: ({navigation}) => ({
      tabBarLabel: "主頁",
      headerMode:"none",
      tabBarIcon: ({tintColor}) => (
        <Icon name="home"  />
      ),
    })
  },
  Novel: {
    screen: NovelStack,
    headerMode:"none",
    navigationOptions: ({navigation}) => ({
      tabBarLabel: "小說",
      
      tabBarIcon: ({tintColor}) => (
        <Icon name="book" />
      ),
    }),
  },
  Gallery: {
    name: "Gallery",
    description: "Gallery Tab",
    screen: GalleryStack,
    headerMode:"none",
    navigationOptions: ({navigation}) => ({
      tabBarLabel: "插圖",
      tabBarIcon: ({tintColor}) => (
        <Icon name="images" />
      ),
    }),
  },
}, {
  tabBarPosition: "bottom",
  initialRouteName: "Novel",
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