import {
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  FlatList,
  RefreshControl,
  Alert,
  Modal,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, network } from "../../constants";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import CustomInput from "../../components/CustomInput";
import CustomCard from "../../components/CustomCard/CustomCard";
import OptionList from "../../components/OptionList/OptionList";
import InternetConnectionAlert from "react-native-internet-connection-alert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProgressDialog from "react-native-progress-dialog";
import OrderList from "../../components/OrderList/OrderList";
import OrderRequest from "../../components/OrderList/OrderRequest";
import { set, update } from "lodash";
import DateTimePicker from "@react-native-community/datetimepicker";
// import { DateTimePicker } from "expo";
import CustomButton from "../../components/CustomButton";
// import { log } from "console";

const RiderDashboardScreen = ({ navigation, route }) => {
  const { authUser } = route.params;
  const [user, setUser] = useState(authUser);
  const [label, setLabel] = useState("Loading...");
  const [error, setError] = useState("");
  const [isloading, setIsloading] = useState(false);
  const [data, setData] = useState([]);
  const [refeshing, setRefreshing] = useState(false);
  const [alertType, setAlertType] = useState("error");
  const [orders, setOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [orderRequests, setOrderRequests] = useState([]);

  const [riderStatusUpdate, setRiderStatusUpdate] = useState(false);
  const [filterItem, setFilterItem] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [time, setTime] = useState(new Date());
  const [time2, setTime2] = useState(new Date());
  const [fromShowPicker, setFromShowPicker] = useState(false);
  const [ToShowPicker, setToShowPicker] = useState(false);

  //method to remove the auth user from async storage and navigate the login if token expires

  const showFromTimePicker = () => {
    setFromShowPicker(true);
  };

  const hideFromTimePicker = () => {
    setFromShowPicker(false);
  };

  const handleFromTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      setTime(selectedTime);
    }
    hideFromTimePicker();
  };
  const showToTimePicker = () => {
    setToShowPicker(true);
  };

  const hideToTimePicker = () => {
    setToShowPicker(false);
  };

  const handleToTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      setTime2(selectedTime);
    }
    hideToTimePicker();
  };

  const logout = async () => {
    await AsyncStorage.removeItem("authUser");
    navigation.replace("drawers");
  };

  const handleOrderDetail = (item) => {
    navigation.navigate("RiderViewOrderDetailScreen", {
      orderDetail: item,
      Token: getToken(authUser),
      user: authUser,
    });
  };

  //method call on Pull refresh
  const handleOnRefresh = () => {
    setRefreshing(true);
    fetchOrders();
    setRefreshing(false);
  };

  const getToken = (obj) => {
    try {
      setUser(JSON.parse(obj));
    } catch (e) {
      setUser(obj);
      return obj.token;
    }
    return JSON.parse(obj).token;
  };

  //method the fetch the order data from server using API call
  const fetchOrders = () => {
    setAcceptedOrders([]);
    setOrderRequests([]);
    var myHeaders = new Headers();
    myHeaders.append("x-auth-token", getToken(authUser));

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    setIsloading(true);
    fetch(
      `${network.serverip}/rider/getMyOrders/${authUser.email}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.success == true) {
          console.log(result.data.length);
          result.data.forEach((order) => {
            console.log(order._id);
            const riderStatus = order.riderStatus; // Accessing the riderStatus field
            if (riderStatus) {
              alert("Accepted Orders");
              console.log("Accepted Orders");
              setAcceptedOrders((oldData) => [...oldData, order]);
            } else {
              alert("Order Requests");
              console.log("Order Requests");
              setOrderRequests((oldData) => [...oldData, order]);
            }

            console.log({ riderStatus });
          });
          setError("");
        } else {
          setError(result.message);
        }
        setIsloading(false);
      })
      .catch((error) => {
        setIsloading(false);
        setError(error.message);
        console.log("error", error);
      });
  };

  const acceptOrder = (id) => {
    setIsloading(true);
    var myHeaders = new Headers();
    myHeaders.append("x-auth-token", authUser.token);
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      riderStatus: riderStatusUpdate,
    });

    console.log({ riderStatusUpdate });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    fetch(`${network.serverip}/rider/addStatus?id=${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success === true) {
          fetchOrders();
          setError(result.message);
          setAlertType("success");
        } else {
          setError(result.message);
          setAlertType("error");
        }
        setIsloading(false);
      })
      .catch((error) => {
        console.log("Error Start");
        setIsloading(false);
        setError(error.message);
        console.log("error: ", error);
      });
  };

  const updateTime = async (time, time2) => {
    var myHeaders = new Headers();
    const value = await AsyncStorage.getItem("authUser");
    let user = JSON.parse(value);
    console.log(user._id);
    myHeaders.append("x-auth-token", user.token);
    myHeaders.append("Content-Type", "application/json");
    // var myHeaders = new Headers();
    // myHeaders.append("x-auth-token", authUser.token);
    // myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Content-Type", "application/json");
    const formattedTime1 = time.toLocaleTimeString();
    const formattedTime2 = time2.toLocaleTimeString();

    const rawData = JSON.stringify({
      toTime: formattedTime1,
      fromTime: formattedTime2,
    });

    console.log(formattedTime1);
    console.log(formattedTime2);

    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: rawData,
    };

    fetch(`${network.serverip}/rider/setTime?id=${user._id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          alert("done");
        } else {
          alert("not done");
        }
      });
  };

  const handleDelete = (id) => {
    setIsloading(true);

    var myHeaders = new Headers();
    myHeaders.append("x-auth-token", authUser.token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${network.serverip}/rider/riderDelete-product?id=${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 200) {
          fetchOrders();
          setError(result.message);
          setAlertType("success");
        } else {
          alert("joker");
          setError(result.message);
          setAlertType("error");
        }
        setIsloading(false);
      })
      .catch((error) => {
        setIsloading(false);
        setError(error.message);
        console.log("error", error);
      });
  };

  //method for alert
  const showConfirmDialog = (id) => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to delete the category?",
      [
        {
          text: "Yes",
          onPress: () => {
            handleDelete(id);
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  //method to filer the orders for by title [search bar]
  const filter = () => {
    const keyword = filterItem;
    if (keyword !== "") {
      const results = orders?.filter((item) => {
        return item?.orderId.toLowerCase().includes(keyword.toLowerCase());
      });
      setAcceptedOrders(results);
    } else {
      setAcceptedOrders(orders);
    }
  };
  //filter the data whenever filteritem value change
  useEffect(() => {
    filter();
  }, [filterItem]);

  //fetch the orders on initial render
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <InternetConnectionAlert onChange={(connectionState) => {}}>
      <View style={styles.container}>
        <StatusBar></StatusBar>
        <ProgressDialog visible={isloading} label={label} />
        <View style={styles.topBarContainer}>
          <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.removeItem("authUser");
              navigation.replace("drawers");
            }}
          >
            <Ionicons name="log-out" size={30} color={colors.muted} />
          </TouchableOpacity>
          <View>
            <Text style={styles.toBarText}>Dashboard</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity style={{ marginHorizontal: 10 }}>
              <Ionicons
                name="alarm"
                size={30}
                color={colors.muted}
                onPress={() => {
                  setModalVisible(true);
                }}
              />
            </TouchableOpacity>
            {/* <TouchableOpacity>
              <Ionicons name="notifications" size={30} color={colors.muted} />
            </TouchableOpacity> */}
          </View>
        </View>
        <View style={styles.headingContainer}>
          <MaterialCommunityIcons name="menu-right" size={30} color="black" />
          <Text style={styles.headingText}>Welcome, {authUser.email}</Text>
        </View>
        <View>
          <ScrollView
            style={{ flex: 1, width: "100%", padding: 2 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refeshing}
                onRefresh={handleOnRefresh}
              />
            }
          >
            <View style={styles.screenNameContainer}>
              <View>
                <Text style={styles.screenNameText}>Orders</Text>
              </View>
            </View>
            {orderRequests && orderRequests.length == 0 ? (
              <Text>{`No order found `}</Text>
            ) : (
              orderRequests.map((order, index) => {
                return (
                  <OrderRequest
                    item={order}
                    key={index}
                    onPress={() => {
                      setRiderStatusUpdate(true);
                      acceptOrder(order._id);
                    }}
                    onPress2={() => {
                      showConfirmDialog(order._id);
                    }}
                  />
                );
              })
            )}
            {/* </ScrollView> */}
            {/* </View> */}

            <View style={styles.screenNameContainer}>
              <View>
                <Text style={styles.screenNameText}>Accepted Orders</Text>
              </View>
            </View>
            <CustomAlert message={error} type={alertType} />
            <CustomInput
              radius={5}
              placeholder={"Search..."}
              value={filterItem}
              setValue={setFilterItem}
            />
            <ScrollView
              style={{ flex: 1, width: "100%", padding: 2 }}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refeshing}
                  onRefresh={handleOnRefresh}
                />
              }
            >
              {acceptedOrders && acceptedOrders.length == 0 ? (
                <Text>{`No order found `}</Text>
              ) : (
                acceptedOrders.map((order, index) => {
                  return (
                    <OrderList
                      item={order}
                      key={index}
                      onPress={() => handleOrderDetail(order)}
                    />
                  );
                })
              )}
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
                    <Button
                      title="Select Time From"
                      onPress={showFromTimePicker}
                    />
                    {fromShowPicker && (
                      <DateTimePicker
                        value={time}
                        mode="time"
                        is24Hour={true}
                        display="spinner"
                        onChange={handleFromTimeChange}
                      />
                    )}
                    {time && (
                      <Text>Selected Time: {time.toLocaleTimeString()}</Text>
                    )}

                    <Button title="Select Time To" onPress={showToTimePicker} />
                    {ToShowPicker && (
                      <DateTimePicker
                        value={time2}
                        mode="time"
                        is24Hour={true}
                        display="spinner"
                        onChange={handleToTimeChange}
                      />
                    )}
                    {time2 && (
                      <Text>Selected Time: {time2.toLocaleTimeString()}</Text>
                    )}
                    {time || time2 != null ? (
                      <CustomButton
                        onPress={() => {
                          setModalVisible(!modalVisible);
                          // alert("Saved");
                          updateTime(time, time2);

                          // setAddress(`${streetAddress}, ${city},${country}`);
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

                    {/* <Text>Hello</Text>
                    <Input type="date"></Input> */}

                    {/* <CustomInput
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

                  <Text style={{ fontSize: 10, margin: 10 }}>
                    Choose Location on Map other wise your cuurent location
                    Coordinates will be saved.
                  </Text>
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
                  )} */}
                  </View>
                </View>
              </Modal>
            </ScrollView>
          </ScrollView>
        </View>
      </View>
    </InternetConnectionAlert>
  );
};

export default RiderDashboardScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 0,
    flex: 1,
    marginHorizontal: 4,
  },
  topBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  toBarText: {
    fontSize: 15,
    fontWeight: "600",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "center",
  },
  bodyContainer: {
    width: "100%",
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
    borderWidth: 1,
  },
  headingContainer: {
    display: "flex",
    justifyContent: "flex-start",
    paddingLeft: 2,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
  },
  headingText: {
    fontSize: 20,
    color: colors.muted,
    fontWeight: "800",
  },
  actionContainer: { padding: 20, width: "100%", flex: 1 },
  TopBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  formContainer: {
    flex: 2,
    justifyContent: "flex-start",
    alignItems: "center",
    display: "flex",
    width: "100%",
    flexDirecion: "row",
    padding: 5,
  },

  buttomContainer: {
    width: "100%",
  },
  bottomContainer: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  screenNameContainer: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
    marginHorizontal: 10,
  },
  screenNameParagraph: {
    marginTop: 5,
    fontSize: 15,
  },
});
