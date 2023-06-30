import { StyleSheet, Text, View,Dimensions ,StatusBar, Button} from 'react-native'
import React,{ useState, useRef} from 'react'
import MapView, { PROVIDER_GOOGLE,Marker } from 'react-native-maps';
import { TextInput } from 'react-native-gesture-handler';
import * as Location from 'expo-location';


const Locationtest = () => {

  const [markerCoords, setMarkerCoords] = useState(null);

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    console.log("cords are :",latitude ,"and ",longitude)
    setMarkerCoords({ latitude, longitude });
  };


  const mapRef = useRef(null);
  const [lat,setlat] = useState(45);
  const [long,setLong] = useState(-122.4324);

  

    const getCurrentLocation= async ()=> {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }
      
        let location = await Location.getCurrentPositionAsync({});
        let latitude = location.coords.latitude;
        let longitude = location.coords.longitude;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

        setLong(longitude);
        setlat(latitude);


        handleMoveToMarker()

      }

    
  

  const { width, height } = Dimensions.get('window');
const ppi = Dimensions.get('screen').scale * 160;
const widthInches = width / ppi;
const heightInches = height / ppi;

// setTimeout(() => {
//   handleMoveToMarker()
// }, 2000);
// const navigationBarHeight = useSafeAreaInsets().bottom;
const handleMoveToMarker = () => {
  console.log("moves")
  mapRef.current.animateToRegion({
    latitude:lat,
    longitude:long,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
};

  const statusBarHeight = StatusBar.currentHeight;
  // const navigationBarHeight = useSafeAreaInsets();
  console.log(`Width: ${widthInches}, Height: ${{}}`);
  return (
    <View>
       <MapView
        ref={mapRef}
        style={{height:height*(3/4),marginTop:statusBarHeight}}
        onPress={handleMapPress}
        initialRegion={{
          latitude: 37.7749,
          longitude: -122.4194,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >

{markerCoords && (
          <Marker coordinate={markerCoords} />
        )}

<Marker
            coordinate={{ latitude: lat, longitude: long }}
            title="My location"
            description="Marker Description"
          />
      </MapView>





     <Button title='move' onPress={() => {
  handleMoveToMarker()
}}/>

<Button title='my location' onPress={() => {
  getCurrentLocation()
}}/>

<Text>{lat}</Text>
<Text>{long}</Text>

    </View>
  )
}

export default Locationtest

const styles = StyleSheet.create({})




