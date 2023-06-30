import {
  StyleSheet,
  Text,
  StatusBar,
  View,
  ScrollView,
  TouchableOpacity,
  Modal
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { colors, network } from "../../constants";
import { Ionicons,FontAwesome,FontAwesome5 } from "@expo/vector-icons";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import ProgressDialog from "react-native-progress-dialog";
import BasicProductList from "../../components/BasicProductList/BasicProductList";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import DropDownPicker from "react-native-dropdown-picker";
import * as Location from 'expo-location';
import MapView, { PROVIDER_GOOGLE, Marker ,Polyline,MapViewDirections} from 'react-native-maps';

const RiderViewOrderDetailScreen = ({ navigation, route }) => {
 const [customerLat, setCustomerLat] = useState(34.8057189);
  const [customerLong, setCustomerLong] = useState(71.3497022);
  const [riderLat, setRiderLat] = useState(45);
  const [riderLong, setRiderLong] = useState(-122.4324);
  const mapRef = useRef(null);
  const [lat, setLat] = useState(45);
  const [long, setLong] = useState(-122.4324);
  const [modalVisible, setModalVisible] = useState(false);
  const [DirectionButton, setDirectionButton] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [zipcode, setZipcode] = useState("");
  const { orderDetail, Token } = route.params;
  const [isloading, setIsloading] = useState(false);
  const [label, setLabel] = useState("Loading..");
  const [error, setError] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [totalCost, setTotalCost] = useState(0);
  const [address, setAddress] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [statusDisable, setStatusDisable] = useState(false);
  const [items, setItems] = useState([
    { label: "Sent To Rider", value: "Sent To Rider" },
    { label: "Shipped", value: "Shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Pending", value: "pending" },

  ]);

  const handleMoveToMarker = (lati,longi) => {
    console.log("moves")
    mapRef.current.animateToRegion({
      latitude: lati,
      longitude: longi,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };


  //method to convert the time into AM PM format
  function tConvert(time) {
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join("");
  }

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
    setRiderLat(latitude);
    setRiderLong(longitude);


    handleMoveToMarker(latitude,longitude)

  }

  const getCurrentLocationRider = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    let latitude = location.coords.latitude;
    let longitude = location.coords.longitude;
    console.log(`riderLatitude: ${latitude}, riderLongitude: ${longitude}`);

    
    setRiderLat(latitude);
    setRiderLong(longitude);

  }

  //method to convert the Data into dd-mm-yyyy format
  const dateFormat = (datex) => {
    let t = new Date(datex);
    const date = ("0" + t.getDate()).slice(-2);
    const month = ("0" + (t.getMonth() + 1)).slice(-2);
    const year = t.getFullYear();
    const hours = ("0" + t.getHours()).slice(-2);
    const minutes = ("0" + t.getMinutes()).slice(-2);
    const seconds = ("0" + t.getSeconds()).slice(-2);
    const time = tConvert(`${hours}:${minutes}:${seconds}`);
    const newDate = `${date}-${month}-${year}, ${time}`;

    return newDate;
  };

  //method to update the status using API call
  const handleUpdateStatus = (id) => {
    setIsloading(true);
    setError("");
    setAlertType("error");
    var myHeaders = new Headers();
    myHeaders.append("x-auth-token", Token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    console.log(
      `Link:${network.serverip}/admin/order-status?orderId=${id}&status=${value}`
    );

    fetch(
      `${network.serverip}/admin/order-status?orderId=${id}&status=${value}`,
      requestOptions
    ) //API call
      .then((response) => response.json())
      .then((result) => {
        if (result.success == true) {
          setError(`Order status is successfully updated to ${value}`);
          setAlertType("success");
          setIsloading(false);
        }
      })
      .catch((error) => {
        setAlertType("error");
        setError(error);
        console.log("error", error);
        setIsloading(false);
      });
  };

  // calculate the total cost and set the all requried variables on initial render
  useEffect(() => {
    getCurrentLocationRider();
    setError("");
    setAlertType("error");
    if (orderDetail?.status == "delivered") {
      setStatusDisable(true);
    } else {
      setStatusDisable(false);
    }
    setValue(orderDetail?.status);
    setAddress(
      orderDetail?.country +
      ", " +
      orderDetail?.city +
      ", " +
      orderDetail?.shippingAddress
    );
    setCustomerLat(orderDetail?.customerLatitude);
    setCustomerLong(orderDetail?.customerLongitude);
    setTotalCost(
      orderDetail?.items.reduce((accumulator, object) => {
        return (accumulator + object.price) * object.quantity;
      }, 0) // calculate the total cost
    );
  }, []);
  return (
    <View style={styles.container}>
      <ProgressDialog visible={isloading} label={label} />
      <StatusBar></StatusBar>
      <View style={styles.TopBarContainer}>
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
      </View>
      <View style={styles.screenNameContainer}>
        <View>
          <Text style={styles.screenNameText}>Order Details</Text>
        </View>
        <View>
          <Text style={styles.screenNameParagraph}>
            View all detail about order
          </Text>
        </View>
      </View>
      <CustomAlert message={error} type={alertType} />
      <ScrollView
        style={styles.bodyContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.containerNameContainer}>
          <View>
            <Text style={styles.containerNameText}>Ship & Bill to</Text>
          </View>
        </View>
        <View style={styles.ShipingInfoContainer}>
          <Text style={styles.secondarytextMedian}>
            {orderDetail?.user?.name}
          </Text>
          <Text style={styles.secondarytextMedian}>
            {orderDetail?.user?.email}
          </Text>
          <Text style={styles.secondarytextSm}>{address}</Text>
          <Text style={styles.secondarytextSm}>{orderDetail?.zipcode}</Text>
        </View>
        <View style={{}}>
          <CustomButton
            text={"View Location"}
            onPress={() => {
              setTimeout(() => {
                setLat(customerLat);
                setLong(customerLong);
                handleMoveToMarker(customerLat,customerLong)
              }, 1);

              setModalVisible(true)
            }}
          />
        </View>
        <View>
          <Text style={styles.containerNameText}>Order Info</Text>
        </View>
        <View style={styles.orderInfoContainer}>
          <Text style={styles.secondarytextMedian}>
            Order # {orderDetail?.orderId}
          </Text>
          <Text style={styles.secondarytextSm}>
            Ordered on {dateFormat(orderDetail?.updatedAt)}
          </Text>
          {orderDetail?.shippedOn && (
            <Text style={styles.secondarytextSm}>
              Shipped on {orderDetail?.shippedOn}
            </Text>
          )}
          {orderDetail?.deliveredOn && (
            <Text style={styles.secondarytextSm}>
              Delivered on {orderDetail?.deliveredOn}
            </Text>
          )}
        </View>
        <View style={styles.containerNameContainer}>
          <View>
            <Text style={styles.containerNameText}>Package Details</Text>
          </View>
        </View>
        <View style={styles.orderItemsContainer}>
          <View style={styles.orderItemContainer}>
            <Text style={styles.orderItemText}>Package</Text>
            <Text>{value}</Text>
          </View>
          <View style={styles.orderItemContainer}>
            <Text style={styles.orderItemText}>
              Order on : {dateFormat(orderDetail?.updatedAt)}
            </Text>
          </View>
          <ScrollView
            style={styles.orderSummaryContainer}
            nestedScrollEnabled={true}
          >
            {orderDetail?.items.map((product, index) => (
              <View key={index}>
                <BasicProductList
                  title={product?.productId?.title}
                  price={product?.price}
                  quantity={product?.quantity}
                />
              </View>
            ))}
          </ScrollView>
          <View style={styles.orderItemContainer}>
            <Text style={styles.orderItemText}>Total</Text>
            <Text>{totalCost}$</Text>
          </View>
        </View>
        <View style={styles.emptyView}></View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <View>
          <DropDownPicker
            style={{ width: 200 }}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            disabled={statusDisable}
            disabledStyle={{
              backgroundColor: colors.light,
              borderColor: colors.white,
            }}
            labelStyle={{ color: colors.muted }}
          />
        </View>
        <View>
          {statusDisable == false ? (
            <CustomButton
              text={"Update"}
              onPress={() => handleUpdateStatus(orderDetail?._id)}
            />
          ) : (
            <CustomButton text={"Update"} disabled />
          )}
        </View>
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


            <MapView
              ref={mapRef}
              style={{ width: 300, height: 300, borderRadius: 20, margin: 10 }}

              initialRegion={{
                latitude: lat,
                longitude: long,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              // toolbarEnabled={DirectionButton}
            >
              { 1==0 ?<Polyline
              coordinates={[{ latitude: customerLat, longitude: customerLong },
              { latitude: riderLat, longitude: riderLong }]}
              strokeColor="yellow"
              strokeWidth={6}
              title="Customer location"
            description="Destination"
              />: null}

          {/* <MapViewDirections
          origin={{latitude: lat, longitude: long}}
          destination={{latitude: lat+0.2, longitude: long+0.2}}
          apikey={GOOGLE_API_KEY}
          strokeWidth={4}
          strokeColor="#111111"
        /> */}

        

              <Marker
            coordinate={{ latitude: customerLat, longitude: customerLong }}
            title="Customer location"
            description="Destination"
            onPress={()=>{
              setDirectionButton(true);
            }}
            ><Ionicons name="people" size={30} color="#900" /></Marker>


            <Marker
            coordinate={{ latitude: riderLat, longitude: riderLong  }}
            title="My location"
            description="Source"
            onPress={()=>{
              setDirectionButton(false);
            }}
            ><FontAwesome name="motorcycle" size={30} color="blue" /></Marker>

            </MapView>

            <Text style={{fontSize:10,margin:10}}>Click on <Ionicons name="people" size={12} color="#900" /> Customer Location and then press  <FontAwesome5 name="directions" size={12} color="#4485f5" /> Navigation icon to see route to Customer Location from Your location.</Text>

            <CustomButton
              onPress={() => {
                setLat(customerLat);
                setLong(customerLong);
                setTimeout(() => {
                  handleMoveToMarker(customerLat,customerLong)
                }, 1);;
              }}
              text={"View Customer Location"}
            />

            <CustomButton
              onPress={() => {
                getCurrentLocation();
              }}
              text={"View My Location"}
            />

            {/* <CustomButton
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
              text={"View Distance "}
            /> */}


            <CustomButton
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
              text={"close"}
            />

          </View>

        </View>
      </Modal>
    </View>
  );
};

export default RiderViewOrderDetailScreen;

const styles = StyleSheet.create({
  container: {
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingBottom: 0,
    flex: 1,
  },
  TopBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  screenNameContainer: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
  },
  screenNameParagraph: {
    marginTop: 10,
    fontSize: 15,
  },
  bodyContainer: { flex: 1, width: "100%", padding: 5 },
  ShipingInfoContainer: {
    marginTop: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,
    borderColor: colors.muted,
    elevation: 5,
    marginBottom: 10,
  },
  containerNameContainer: {
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  containerNameText: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.muted,
  },
  secondarytextSm: {
    color: colors.muted,
    fontSize: 13,
  },
  orderItemsContainer: {
    marginTop: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,

    borderColor: colors.muted,
    elevation: 3,
    marginBottom: 10,
  },
  orderItemContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderItemText: {
    fontSize: 13,
    color: colors.muted,
  },
  orderSummaryContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    maxHeight: 220,
    width: "100%",
    marginBottom: 5,
  },
  bottomContainer: {
    backgroundColor: colors.white,
    width: "110%",
    height: 70,
    borderTopLeftRadius: 10,
    borderTopEndRadius: 10,
    elevation: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingLeft: 10,
    paddingRight: 10,
  },
  orderInfoContainer: {
    marginTop: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,

    borderColor: colors.muted,
    elevation: 1,
    marginBottom: 10,
  },
  primarytextMedian: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "bold",
  },
  secondarytextMedian: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: "bold",
  },
  emptyView: {
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
  },
});


