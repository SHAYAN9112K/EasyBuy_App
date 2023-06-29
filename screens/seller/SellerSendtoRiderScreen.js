import {
  StyleSheet,
  Text,
  StatusBar,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { colors, network } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import CustomInput from "../../components/CustomInput/";
import ProgressDialog from "react-native-progress-dialog";
import UserList from "../../components/UserList/UserList";
import RiderList from "../../components/RiderList/RiderList";
import OptionList from "../../components/OptionList/OptionList";

const SellerSendtoRiderScreen = ({ navigation, route }) => {
  const [name, setName] = useState("");
  const { authUser, orderDetail } = route.params;
  const [user, setUser] = useState({});
  const [isloading, setIsloading] = useState(false);
  const [refeshing, setRefreshing] = useState(false);
  const [alertType, setAlertType] = useState("error");
  const [label, setLabel] = useState("Loading...");
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [filterItem, setFilterItem] = useState("");

  //method to convert the authUser to json object
  const getToken = (obj) => {
    try {
      setUser(JSON.parse(obj));
    } catch (e) {
      setUser(obj);
      return obj.token;
    }
    return JSON.parse(obj).token;
  };

  //method the fetch the users from server using API call
  const fetchUsers = () => {
    var myHeaders = new Headers();
    myHeaders.append("x-auth-token", getToken(authUser));

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    setIsloading(true);
    fetch(`${network.serverip}/seller/getRiders`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setUsers(result.data);
          setFoundItems(result.data);
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

  //method call on pull refresh
  const handleOnRefresh = () => {
    setRefreshing(true);
    fetchUsers();
    setRefreshing(false);
  };

  const handleSend = async (selectedRider) => {
    setIsloading(true);

    var myHeaders1 = new Headers();
    myHeaders1.append("x-auth-token", authUser.token);
    myHeaders1.append("Content-Type", "application/json");

    var raw1 = JSON.stringify({
      riderEmail:selectedRider.email,
      status:"Sent To Rider"
    });

    var requestOptions1 = {
      method: "PATCH",
      headers: myHeaders1,
      body: raw1,
      redirect: "follow",
    };

    await fetch(
      `${network.serverip}/rider/updateOrder?id=${orderDetail._id}`,
      requestOptions1
    )
      .then((response) => response.json())
      .then((result) => {navigate
        if (result.success == true) {
          setIsloading(false);
          alert("order Sent to Rider Succesfully");
          navigation.navigate("SellerDashboardScreen")
        }
      })
      .catch((error) => {
        setIsloading(false);
        setError(error.message);
        console.log("errorss", error);
      });
  }

  //method to filer the orders for by title [search bar]
  const filter = () => {
    const keyword = filterItem;
    if (keyword !== "") {
      const results = users.filter((user) => {
        return user.name.toLowerCase().includes(keyword.toLowerCase());
      });

      setFoundItems(results);
    } else {
      setFoundItems(users);
    }
    setName(keyword);
  };

  //filter the data whenever filteritem value change
  useEffect(() => {
    filter();
  }, [filterItem]);

  //fetch the orders on initial render
  useEffect(() => {
    fetchUsers();
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
        <TouchableOpacity disabled>
          <AntDesign name="user" size={25} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.screenNameContainer}>
        <View>
          <Text style={styles.screenNameText}>View Riders</Text>
        </View>
        <View>
          <Text style={styles.screenNameParagraph}>View all riders</Text>
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
        style={{ flex: 1, width: "100%" }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refeshing} onRefresh={handleOnRefresh} />
        }
      >
        {foundItems && foundItems.length == 0 ? (
          <Text>{`No user found with the name of ${filterItem}!`}</Text>
        ) : (
          foundItems.map((item, index) => (
            <View style={styles.container1}>
              <RiderList
                key={Math.random()}
                username={item?.name}
                email={item?.email}
                usertype={item?.userType}
              // onPress={{}}
              />
              <TouchableOpacity style={styles.actionButton} onPress={() => handleSend(item)}>
                <Text style={{ color: colors.white }}>Send</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default SellerSendtoRiderScreen;

const styles = StyleSheet.create({
  container: {
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    flex: 1,
  },
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
    marginBottom: 10,
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
  },
  screenNameParagraph: {
    marginTop: 5,
    fontSize: 15,
  },
  container1: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
    height: 70,
    borderRadius: 10,
    elevation: 2,
    marginLeft: 10,
    marginRight: 10,
    margin: 5,
    paddingRight: 10
  },
  actionButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
    height: 30,
    paddingHorizontal: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
    elevation: 2,
  },
});
