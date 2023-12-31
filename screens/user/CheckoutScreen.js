import {
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Modal,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useRef } from "react";
import BasicProductList from "../../components/BasicProductList/BasicProductList";
import { colors, network } from "../../constants";
import CustomButton from "../../components/CustomButton";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreaters from "../../states/actionCreaters/actionCreaters";
import { bindActionCreators } from "redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomInput from "../../components/CustomInput";
import ProgressDialog from "react-native-progress-dialog";
import * as Location from 'expo-location';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { event } from "react-native-reanimated";
import { tr } from "date-fns/locale";

const CheckoutScreen = ({ navigation, route }) => {

  const mapRef = useRef(null);
  const [lat, setLat] = useState(33.8057189);
  const [markerCoords, setMarkerCoords] = useState({ latitude:0, longitude:0 });
  const [long, setLong] = useState(72.3497022);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibletop, setModalVisibletop] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [temp, setTemp] = useState(false);
  const cartproduct = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const { emptyCart } = bindActionCreators(actionCreaters, dispatch);

  const [deliveryCost, setDeliveryCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [zipcode, setZipcode] = useState("");

  const handleMapPress = (event) => {
    setTemp(true)
    const { latitude, longitude } = event.nativeEvent.coordinate;
    console.log("cords are :", latitude, "and ", longitude)
    setLat(latitude);
    setLong(longitude);
    setMarkerCoords({ latitude, longitude });
    handleMarkerPress(event);

  };

  const handleMarkerPress = async (event) => {
    // setTemp(false)
    const { coordinate } = event.nativeEvent;

    const geocode = await Location.reverseGeocodeAsync(coordinate);
    // setLocationInfo(geocode[0]);
    console.log(geocode[0])
    setCountry(geocode[0].country);
    setCity(geocode[0].city);
    setZipcode(geocode[0].postalCode);
    await this.mark.setNativeProps({ title: `Countryis: ${geocode[0].country}` ,description:`City: ${geocode[0].city}` });
     setTimeout(() => {
      this.mark.showCallout();
      setTemp(false)
     }, 1);
  };


  //method to remove the authUser from aysnc storage and navigate to login
  const logout = async () => {
    await AsyncStorage.removeItem("authUser");
    navigation.replace("drawers");
  };


  const getCurrentLocation = async () => {
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
    setLat(latitude);
  }



  //method to handle checkout
  const handleCheckout = async () => {
    setIsloading(true);
    var myHeaders = new Headers();
    const value = await AsyncStorage.getItem("authUser");
    let user = JSON.parse(value);
    console.log("Checkout:", user.token);
    let authEmail = user.email;

    myHeaders.append("x-auth-token", user.token);
    myHeaders.append("Content-Type", "application/json");

    var payload = [];
    var totalamount = 0;

    // fetch the cart items from redux and set the total cost
    cartproduct.forEach((product) => {
      let obj = {
        productId: product._id,
        price: product.price,
        quantity: product.quantity,
        sellerEmail: product.sellerEmail
      };
      totalamount += parseInt(product.price) * parseInt(product.quantity);
      payload.push(obj);
    });

    var raw = JSON.stringify({
      items: payload,
      amount: totalamount,
      discount: 0,
      payment_type: "cod",
      country: country,
      status: "pending",
      city: city,
      zipcode: zipcode,
      shippingAddress: streetAddress,
      customerLatitude: lat,
      customerLongitude: long
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(network.serverip + "/checkout", requestOptions) //API call
      .then((response) => response.json())
      .then((result) => {
        console.log("Checkout=>", result);
        if (result.err === "jwt expired") {
          setIsloading(false);
          logout();
        }
        if (result.success == true) {
          setIsloading(false);
          emptyCart("empty");
          navigation.replace("orderconfirm");
        }
      })
      .catch((error) => {
        setIsloading(false);
        console.log("error", error);
      });
  };

  // set the address and total cost on initital render
  useEffect(() => {
    if (streetAddress && city && country != "") {
      setAddress(`${streetAddress}, ${city},${country}`);
    } else {
      setAddress("");
    }
    setTotalCost(
      cartproduct.reduce((accumulator, object) => {
        return accumulator + object.price * object.quantity;
      }, 0)
    );
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar></StatusBar>
      <ProgressDialog visible={isloading} label={"Placing Order..."} />
      <View style={styles.topBarContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons
            name="arrow-back-circle-outline"
            size={30}
            color={colors.muted}
          />
        </TouchableOpacity>
        <View></View>
        <View></View>
      </View>
      <ScrollView style={styles.bodyContainer} nestedScrollEnabled={true}>
        <Text style={styles.primaryText}>Order Summary</Text>
        <ScrollView
          style={styles.orderSummaryContainer}
          nestedScrollEnabled={true}
        >
          {cartproduct.map((product, index) => (
            <BasicProductList
              key={index}
              title={product.title}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </ScrollView>
        <Text style={styles.primaryText}>Total</Text>
        <View style={styles.totalOrderInfoContainer}>
          <View style={styles.list}>
            <Text>Order</Text>
            <Text>{totalCost}$</Text>
          </View>
          <View style={styles.list}>
            <Text>Delivery</Text>
            <Text>{deliveryCost}$</Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.primaryTextSm}>Total</Text>
            <Text style={styles.secondaryTextSm}>
              {totalCost + deliveryCost}$
            </Text>
          </View>
        </View>
        <Text style={styles.primaryText}>Contact</Text>
        <View style={styles.listContainer}>
          <View style={styles.list}>
            <Text style={styles.secondaryTextSm}>Email</Text>
            <Text style={styles.secondaryTextSm}>
              bukhtyar.haider1@gmail.com
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.secondaryTextSm}>Phone</Text>
            <Text style={styles.secondaryTextSm}>+92 3410988683</Text>
          </View>
        </View>
        <Text style={styles.primaryText}>Address</Text>
        <View style={styles.listContainer}>
          <TouchableOpacity
            style={styles.list}
            onPress={() => {
              getCurrentLocation();
              setModalVisible(true)
            }}
          >
            <Text style={styles.secondaryTextSm}>Address</Text>
            <View>
              {country || city || streetAddress != "" ? (
                <Text
                  style={styles.secondaryTextSm}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {address.length < 25
                    ? `${address}`
                    : `${address.substring(0, 25)}...`}
                </Text>
              ) : (
                <Text style={styles.primaryTextSm}>Add</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.primaryText}>Payment</Text>
        <View style={styles.listContainer}>
          <View style={styles.list}>
            <Text style={styles.secondaryTextSm}>Method</Text>
            <Text style={styles.primaryTextSm}>Cash On Delivery</Text>
          </View>
        </View>

        <View style={styles.emptyView}></View>
      </ScrollView>
      <View style={styles.buttomContainer}>
        {country && city && streetAddress != "" ? (
          <CustomButton
            text={"Submit Order"}
            // onPress={() => navigation.replace("orderconfirm")}
            onPress={() => {
              handleCheckout();
            }}
          />
        ) : (
          <CustomButton text={"Submit Order"} disabled />
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modelBody}>
          <View style={styles.modelAddressContainer}>
            <CustomInput
              value={country}
              setValue={setCountry}
              placeholder={"Enter Country"}
            />
            <CustomInput
              value={city}
              setValue={setCity}
              placeholder={"Enter City"}
            />
            <CustomInput
              value={streetAddress}
              setValue={setStreetAddress}
              placeholder={"Enter Street Address"}
            />
            <CustomInput
              value={zipcode}
              setValue={setZipcode}
              placeholder={"Enter ZipCode"}
              keyboardType={"number-pad"}
            />

            <Text style={{ fontSize: 10, margin: 10 }}>Choose Location on Map other wise your cuurent location Coordinates will be saved.</Text>
            <CustomButton
              onPress={() => {
                setModalVisibletop(!modalVisibletop);
              }}
              text={"Choose Location on Map"}
            />
            {streetAddress || city || country != "" ? (
              <CustomButton
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setAddress(`${streetAddress}, ${city},${country}`);
                }}
                text={"save"}
              />
            ) : (
              <CustomButton
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
                text={"close"}
              />
            )}
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibletop}
        onRequestClose={() => {
          setModalVisibletop(!modalVisible);
        }}
      >
        <View style={styles.modelBody}>

          <View style={styles.modelAddressContainer}>


            <MapView
              ref={mapRef}
              style={{ width: 300, height: 300, borderRadius: 20, margin: 10 }}
              onPress={handleMapPress}
              initialRegion={{
                latitude: lat,
                longitude: long,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onLayout={() => { this.mark.showCallout(); }}
            >

              
                <Marker ref={ref => { this.mark = ref; }} showCallout={true} coordinate={markerCoords} onPress={handleMarkerPress} title={`Country: ${country}`} 
                  description={`City: ${city}`}></Marker>
              

              



            </MapView>

            <Text style={{ fontSize: 10, margin: 10 }}>Tap on a place to select Address</Text>
            {temp?
              <View style={{flexDirection:'row'}}><Text style={{ fontSize: 10, margin: 10 }}>Fetching Location...</Text><ActivityIndicator/></View>
              :<Text style={{ fontSize: 10, margin: 10 }}>{city}  {country} </Text>
            }
            <CustomButton
              onPress={() => {
                setModalVisibletop(!modalVisible);
              }}
              text={"close"}
            />

          </View>

        </View>
      </Modal>

    </View>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 0,
    flex: 1,
  },
  topBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  toBarText: {
    fontSize: 15,
    fontWeight: "600",
  },
  bodyContainer: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  orderSummaryContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    maxHeight: 220,
  },
  totalOrderInfoContainer: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: colors.white,
  },
  primaryText: {
    marginBottom: 5,
    marginTop: 5,
    fontSize: 20,
    fontWeight: "bold",
  },
  list: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    backgroundColor: colors.white,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
    padding: 10,
  },
  primaryTextSm: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.primary,
  },
  secondaryTextSm: {
    fontSize: 15,
    fontWeight: "bold",
  },
  listContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
  },
  buttomContainer: {
    width: "100%",
    padding: 20,
    paddingLeft: 30,
    paddingRight: 30,
  },
  emptyView: {
    width: "100%",
    height: 20,
  },
  modelBody: {
    flex: 1,
    display: "flex",
    flexL: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  modelAddressContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: 320,
    backgroundColor: colors.white,
    borderRadius: 20,
    elevation: 3,
    borderColor: colors.muted,
    borderWidth: 1
  },
});
