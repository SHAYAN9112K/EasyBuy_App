import React from "react";
import { ImageComponent, StyleSheet, TextInput, View } from "react-native";
import { colors } from "../../constants";
import { Ionicons } from "@expo/vector-icons";

const PasswordInput = ({
  value,
  setValue,
  placeholder,
  secureTextEntry,
  placeholderTextColor,
  onFocus,
  radius,
  width = "85%",
  keyboardType,
  maxLength,
}) => {
  return (
    <View style={{ width: width }}>
      <TextInput
        placeholder={placeholder}
        onChangeText={setValue}
        value={value}
        secureTextEntry={secureTextEntry}
        style={styles.PasswordInput}
        placeholderTextColor={placeholderTextColor}
        onFocus={onFocus}
        borderRadius={radius}
        maxLength={maxLength}
        keyboardType={keyboardType}
      />
    </View>
  );
};

export default PasswordInput;

const styles = StyleSheet.create({
  PasswordInput: {
    height: 40,
    marginBottom: 10,
    marginTop: 10,
    width: "100%",
    padding: 5,
    backgroundColor: colors.white,
    elevation: 5,
    paddingHorizontal: 20,
  },
});
