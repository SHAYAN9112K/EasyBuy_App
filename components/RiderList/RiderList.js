import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants";
import { TouchableOpacity } from "react-native-gesture-handler";

const RiderList = ({ username, email, onPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftside}>
        <View style={styles.profileContainer}>
          <Ionicons
            name="person-circle-outline"
            size={40}
            color={colors.primary_light}
          />
        </View>
        <View style={styles.userInfoContainer}>
          <Text style={styles.usernameText}>{username}</Text>
          <Text style={styles.userEmailText}>{email}</Text>
        </View>
      </View>
      <View>
          <TouchableOpacity style={styles.actionButton} onPress={onPress}>
            <Text style={{ color: colors.white }}>Send</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
};

export default RiderList;

const styles = StyleSheet.create({
  container: {
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
    paddingRight:10
  },
  leftside: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
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
});
