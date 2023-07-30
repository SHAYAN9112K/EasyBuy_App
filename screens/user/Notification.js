import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import ProgressDialog from "react-native-progress-dialog";
import { Ionicons } from "@expo/vector-icons";
import Notificaion from "../../components/Notification/GetNotification";
import { network } from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

// import { log } from "react-native-reanimated";

const Notification = ({ navigation }) => {
  const [isloading, setIsloading] = useState(false);
  const [label, setLabel] = useState("Loading...");
  const [notification, setNotification] = useState([]);
  const [refeshing, setRefreshing] = useState(false);

  const handleOnRefresh = () => {
    setRefreshing(true);
    fetchNotification();
    setRefreshing(false);
  };

  const fetchNotification = async () => {
    console.log("ABCCCC");
    console.log("Afdadfasfd");

    var myHeaders = new Headers();
    // myHeaders.append("")
    const value = await AsyncStorage.getItem("authUser");
    let user = JSON.parse(value);
    console.log(user._id);
    myHeaders.append("x-auth-token", user.token);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
    fetch(`${network.serverip}/get-notification?id=${user._id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          console.log("succeded");
          setNotification(result.data);
        } else {
          console.log("Noooo");
        }
      })
      .catch((error) => {
        alert("Error fetching notifications");
      });

    // <Notificaion/>
  };
  useEffect(() => {
    fetchNotification();
  }, []);

  return (
    <View style={styles.container}>
      <ProgressDialog visible={isloading} label={label} />
      <StatusBar></StatusBar>
      <View style={styles.TopBarContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
            // close();
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
          <Text style={styles.screenNameText}>View Notification</Text>
        </View>
        <View>
          <Text style={styles.screenNameParagraph}>View all Notification</Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1, width: "100%" }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refeshing} onRefresh={handleOnRefresh} />
        }
      >
        {notification && notification.length > 0 ? (
          <View style={styles.container1}>
            {notification.map((noti, index) => (
              <Notificaion
                key={Math.random()}
                amount={noti.amount}
                rider={noti.status}
                email={noti.riderEmail}
              />
            ))}
          </View>
        ) : (
          <View>
            <Text>No notification avaliable right now</Text>
          </View>
        )}
      </ScrollView>
    </View>
    //         <View>
    //     <Text>Helloo</Text>
    //   </View > */}
  );
};
export default Notification;
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
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingBottom: 20,
    marginBottom: 20,
    elevation: 2,
    marginLeft: 10,
    marginRight: 10,
    margin: 5,
    padding: 5,
  },
});
