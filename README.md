# Mobility Choices App
Mobility Choices App is an app written in react-native, which can be used to record and evaluate routes. It can also be used to search for routes based on defined preferences. 

## Requirements
- Node v10.15.3
- React-Native v0.51.0
- React-Native-cli v2.0.1
- CocoaPods v1.4.0
- Gradle v4.6 

## Installation
1. create a react-native project
2. clone repository into the react-native project
```
git clone https://github.com/MobilityChoicesProject/mobility_choices_app.git

```
3. installation of the libraries
```
npm install
react-native link 
pod install (in the ios directory) 

```

## Run the App

Start the node packager
```
react-native start
```
### With Android Studio
- Import the android directory of the project into Android Studio
- Now you can run the app on an emulator 

### With Xcode
- Open the .xcworkspace from the ios folder with Xcode 
- Change to the legacy build system 
- Now you can choose a Iphone emulator and run the app on it 


## Implementation 
The implementation consists of several subfolder:

### Components
Here are reusable components.

For example, if the same component was needed multiple times in the app, it got its own file in that folder and could be easily imported into the different file 

### Container
For the overview, a subfolder is created in this folder for each screen of the app.

The main folder contains the file MobilityChoices.js. 
This is where the whole app starts.
Important: the navigator is initialized in this file. When adding new screens, for example, it must be added here. 

Main page of the app: Dashboard

### Lib
This folder contains all self-created libraries. 

#### HelperAPI
Functions that are needed several times in different files.

#### RealmAPI
Connection to the local database. 

Realm is used to create the DB schema.

External access: Import RealmAPI
    
#### MobilityAPI
Interface to the server

When changing the server, you only have to replace the constant SERVER_URL.

Access:
Import MobilityAPI   
