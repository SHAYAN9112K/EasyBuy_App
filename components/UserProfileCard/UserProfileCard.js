import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../../constants";

const UserProfileCard = ({ name, email, img }) => {
  console.log("imageee:  " + img);
  return (
    <View style={styles.Container}>
      <View style={styles.avatarContainer}>
        {/* <Icon name="person" size={80} color={colors.primary} /> */}
        <Image
          source={{ uri: img }}
          style={{ width: "100%", height: "100%" }}
        />

        {/* <Image
          source={img}
          style={{
            height: "100%",
            width: "100%",
            resizeMode: "contain",
            borderRadius: 20,
            borderColor: "black",
            borderWidth: 0.5,
          }}
        /> */}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.usernameText}>{name}</Text>
        <Text style={styles.secondaryText}>{email}</Text>
      </View>
    </View>
  );
};

export default UserProfileCard;

const styles = StyleSheet.create({
  Container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  avatarContainer: {
    display: "flex",
    width: "40%",
    height: "90%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary_light,
    borderRadius: 20,
  },
  infoContainer: {
    display: "flex",
    width: "50%",

    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: colors.light,

    paddingLeft: 10,
  },
  usernameText: {
    fontWeight: "bold",
    fontSize: 25,
  },
  secondaryText: {
    fontWeight: "bold",
    fontSize: 12,
  },
});
