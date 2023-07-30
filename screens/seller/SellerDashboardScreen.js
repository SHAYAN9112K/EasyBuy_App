import {
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../constants";
import CustomCard from "../../components/CustomCard/CustomCard";
import OptionList from "../../components/OptionList/OptionList";
import InternetConnectionAlert from "react-native-internet-connection-alert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProgressDialog from "react-native-progress-dialog";

const SellerDashboardScreen = ({ navigation, route }) => {
  const { authUser } = route.params;
  const [user, setUser] = useState(authUser);
  const [label, setLabel] = useState("Loading...");
  const [error, setError] = useState("");
  const [isloading, setIsloading] = useState(false);
  const [data, setData] = useState([]);
  const [refeshing, setRefreshing] = useState(false);

  //method to remove the auth user from async storage and navigate the login if token expires
  const logout = async () => {
    await AsyncStorage.removeItem("authUser");
    navigation.replace("drawers");
  };

  var myHeaders = new Headers();
  myHeaders.append("x-auth-token", authUser.token);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  //method the fetch the statistics from server using API call
  const fetchStats = () => {
    fetch(
      `${network.serverip}/sellerdashboard/${authUser.email}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.success == true) {
          console.log("testingss: " + result);
          //set the fetched data to Data state
          setData([
            {
              id: 1,
              title: "Products",
              value: result.data?.productsCount,
              iconName: "md-square",
              type: "warning",
              screenName: "SellerViewProductScreen",
              status: "all",
            },
            {
              id: 2,
              title: "Pending Orders",
              value: result.data?.PendingOrdersCount,
              iconName: "cart",
              type: "secondary",
              screenName: "SellerViewOrdersScreen",
              status: "pending",
            },
            {
              id: 3,
              title: "Orders In Progress",
              value: result.data?.ProgressOrdersCount,
              iconName: "cart",
              type: "secondary",
              screenName: "SellerViewOrdersScreen",
              status: "progress",
            },
            {
              id: 4,
              title: "Delivered",
              value: result.data?.DeliveredOrdersCount,
              iconName: "cart",
              type: "secondary",
              screenName: "SellerViewOrdersScreen",
              status: "delivered",
            },
            // {
            //   id: 5,
            //   title: "Reviews",
            //   value: result.data?.DeliveredOrdersCount,
            //   iconName: "cart",
            //   type: "secondary",
            //   screenName: "SellerViewOrdersScreen",
            //   status: "reviews",
            // },
          ]);
          setError("");
          setIsloading(false);
        } else {
          console.log(result.err);
          if (result.err == "jwt expired") {
            logout();
          }
          setError(result.message);
          setIsloading(false);
        }
      })
      .catch((error) => {
        setError(error.message);
        console.log("error", error);
        setIsloading(false);
      });
  };

  //method call on Pull refresh
  const handleOnRefresh = () => {
    setRefreshing(true);
    fetchStats();
    setRefreshing(false);
  };

  //call the fetch function initial render
  useEffect(() => {
    fetchStats();
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
          <TouchableOpacity>
            <Ionicons
              name="person-circle-outline"
              size={30}
              color={colors.muted}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.headingContainer}>
          <MaterialCommunityIcons name="menu-right" size={30} color="black" />
          <Text style={styles.headingText}>Welcome, {authUser.email}</Text>
        </View>
        <View style={{ height: 370 }}>
          {data && (
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={refeshing}
                  onRefresh={handleOnRefresh}
                />
              }
              contentContainerStyle={styles.cardContainer}
            >
              {data.map((data) => (
                <CustomCard
                  key={data.id}
                  iconName={data.iconName}
                  title={data.title}
                  value={data.value}
                  type={data.type}
                  onPress={() => {
                    navigation.navigate(data.screenName, {
                      authUser: user,
                      status: data.status,
                    });
                  }}
                />
              ))}
            </ScrollView>
          )}
        </View>
        <View style={styles.headingContainer}>
          <MaterialCommunityIcons name="menu-right" size={30} color="black" />
          <Text style={styles.headingText}>Actions</Text>
        </View>
        <View style={{ flex: 1, width: "100%" }}>
          <ScrollView style={styles.actionContainer}>
            <OptionList
              text={"Products"}
              Icon={Ionicons}
              iconName={"md-square"}
              onPress={() =>
                navigation.navigate("SellerViewProductScreen", {
                  authUser: user,
                })
              }
              onPressSecondary={() =>
                navigation.navigate("SellerAddProductScreen", {
                  authUser: user,
                })
              }
              type="morden"
            />
            <OptionList
              text={"Orders"}
              Icon={Ionicons}
              iconName={"cart"}
              onPress={() =>
                navigation.navigate("SellerViewOrdersScreen", {
                  authUser: user,
                  status: "all",
                })
              }
              type="morden"
            />

            <View style={{ height: 20 }}></View>
          </ScrollView>
        </View>
      </View>
    </InternetConnectionAlert>
  );
};

export default SellerDashboardScreen;

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
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "center",
  },
  bodyContainer: {
    width: "100%",
  },
  headingContainer: {
    display: "flex",
    justifyContent: "flex-start",
    paddingLeft: 10,
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
});
