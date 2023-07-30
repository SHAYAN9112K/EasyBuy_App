import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants";
import { TouchableOpacity } from "react-native-gesture-handler";

const AdminUserList = ({ amount, rider, email }) => {
  return (
    <View style={styles.container1}>
      <View style={styles.profileContainer}>
        <Ionicons
          name="person-circle-outline"
          size={40}
          color={colors.primary_light}
        />
      </View>
      <View style={styles.userInfoContainer}>
        {/* <Text style={styles.usernameText}>{username}</Text> */}
        {/* {toTime && fromTime && ( */}
        {/* // <Text style={styles.userEmailText}>{toTime}</Text> */}
        {amount && rider && email ? (
          <View>
            <Text style={styles.userEmailText}>Status:{rider}</Text>
            <Text style={styles.userEmailText}>Amount: {amount}</Text>

            <Text style={styles.userEmailText}>To: {email}</Text>
          </View>
        ) : (
          <View>
            <Text>No notification avaliable</Text>
          </View>
        )}

        {/* )} */}

        {/* // : ( */}
        {/* //   <View> */}
        {/* //     <Text style={styles.userEmailText}>Time not set</Text> */}
        {/* //     <Text style={styles.userEmailText}>{fromTime}</Text> */}
        {/* //   </View> */}
        {/* // )} */}
        {/* <Text style={styles.userEmailText}>{toTime}</Text> */}
        {/* <Text style={styles.userEmailText}>{email}</Text> */}
      </View>
    </View>
  );
};

export default AdminUserList;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 20,
    // paddingBottom:40,
    alignItems: "center",
    height: 60,

    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    margin: 5,
    paddingRight: 10,
  },
  // leftside: {
  //   display: "flex",
  //   flexDirection: "row",
  //   justifyContent: "flex-start",
  //   alignItems: "center",
  // },
  profileContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  usernameText: {
    fontWeight: "bold",
    fontSize: 15,
  },
  userEmailText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.muted,
  },
  userInfoContainer: {
    marginLeft: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
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
  container1: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: colors.white,
    borderRadius: 10,
    elevation: 2,
    marginLeft: 10,
    marginRight: 10,
    margin: 5,
    padding: 5,
  },
});
