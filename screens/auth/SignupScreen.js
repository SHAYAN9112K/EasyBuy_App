import {
  StyleSheet,
  Text,
  Image,
  StatusBar,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import { colors, network } from "../../constants";
import CustomInput from "../../components/CustomInput";
import PasswordInput from "../../components/PasswordInput";
import header_logo from "../../assets/logo/logo.png";
import CustomButton from "../../components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import InternetConnectionAlert from "react-native-internet-connection-alert";
import DropDownPicker from "react-native-dropdown-picker";
const { width, height } = Dimensions.get("window");
const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [passShow, setPassShow] = useState(true);
  const [passShow1, setPassShow1] = useState(true);
  const [selectedUserType, setSelectedUserType] = useState("");
  const [open, setOpen] = useState(false);
  const [statusDisable, setStatusDisable] = useState(false);
  const [items, setItems] = useState([
    { label: "User", value: "USER" },
    { label: "Seller", value: "SELLER" },
    { label: "Rider", value: "RIDER" },
  ]);

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    email: email,
    password: password,
    name: name,
    userType: selectedUserType,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  //method to post the user data to server for user signup using API call
  const signUpHandle = () => {
    const passwordRegex =
      /^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9!@#$%^&*]{8,}$/;

    if (!passwordRegex.test(password)) {
      if (!/(?=.*[!@#$%^&*])/.test(password)) {
        return setError(
          "Password should contain at least one special character"
        );
      }

      if (!/(?=.*[a-z])/.test(password)) {
        return setError(
          "Password should contain at least one lowercase letter"
        );
      }

      if (!/(?=.*[A-Z])/.test(password)) {
        return setError(
          "Password should contain at least one uppercase letter"
        );
      }

      if (!/(?=.*\d)/.test(password)) {
        return setError("Password should contain at least one digit");
      }
    }

    if (selectedUserType == "") {
      return setError("Please Select User Type");
    }
    if (email == "") {
      return setError("Please enter your email");
    }
    if (name == "") {
      return setError("Please enter your name");
    }
    if (password == "") {
      return setError("Please enter your password");
    }
    if (!email.includes("@")) {
      return setError("Email is not valid");
    }
    if (email.length < 6) {
      return setError("Email is too short");
    }
    if (password.length < 5) {
      return setError("Password must be 6 characters long");
    }
    if (password != confirmPassword) {
      return setError("password does not match");
    }
    fetch(network.serverip + "/register", requestOptions) // API call
      .then((response) => response.json())
      .then((result) => {
        console.log("sdsd", result.message);
        setError(result.message);
        console.log("sdsd", result.message);
        if (result.data["email"] == email) {
          navigation.navigate("drawers");
        }
      })
      .catch((error) => console.log("error"));
  };
  return (
    <ImageBackground
      source={require("../../image/backgroundImg.jpg")}
      style={styles.background}
      opacity={0.5}
    >
      <InternetConnectionAlert
        onChange={(connectionState) => {
          console.log("Connection State: ", connectionState);
        }}
      >
        <KeyboardAvoidingView style={styles.container}>
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
          <ScrollView style={{ flex: 1, width: "100%" }}>
            <View style={styles.welconeContainer}>
              <Image style={styles.logo} source={header_logo} />
            </View>
            <View style={styles.screenNameContainer}>
              <View>
                <Text style={styles.screenNameText}>Sign up</Text>
              </View>
              <View>
                <Text style={styles.screenNameParagraph}>
                  Create your account on Swift Multiservice to get an access to
                  millions of products
                </Text>
              </View>
            </View>
            <View style={styles.formContainer}>
              <CustomAlert message={error} type={"error"} />
              <DropDownPicker
                placeholder={"Select User Type"}
                open={open}
                value={selectedUserType}
                items={items}
                setOpen={setOpen}
                setValue={setSelectedUserType}
                setItems={setItems}
                disabled={statusDisable}
                disabledStyle={{
                  backgroundColor: colors.light,
                  borderColor: colors.white,
                }}
                labelStyle={{ color: colors.muted }}
                style={{ borderColor: "#fff", elevation: 5 }}
              />
              {!open ? null : <View style={{ height: 120 }} />}
              <CustomInput
                value={name}
                setValue={setName}
                placeholder={"Name"}
                placeholderTextColor={colors.muted}
                radius={5}
              />
              <CustomInput
                value={email}
                setValue={setEmail}
                placeholder={"Email"}
                placeholderTextColor={colors.muted}
                radius={5}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <PasswordInput
                  value={password}
                  setValue={setPassword}
                  secureTextEntry={passShow}
                  placeholder={"Password"}
                  placeholderTextColor={colors.muted}
                  radius={5}
                />
                <TouchableOpacity
                  onPress={() => {
                    setPassShow(!passShow);
                  }}
                >
                  {passShow ? (
                    <Ionicons
                      style={{ marginVertical: 15, marginLeft: 15 }}
                      name="eye-off"
                      size={25}
                      color={colors.muted}
                    />
                  ) : (
                    <Ionicons
                      style={{ marginVertical: 15, marginLeft: 15 }}
                      name="eye"
                      size={25}
                      color="black"
                    />
                  )}
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <PasswordInput
                  value={confirmPassword}
                  setValue={setConfirmPassword}
                  secureTextEntry={passShow1}
                  placeholder={"Confirm Password"}
                  placeholderTextColor={colors.muted}
                  radius={5}
                />
                <TouchableOpacity
                  onPress={() => {
                    setPassShow1(!passShow1);
                  }}
                >
                  {passShow1 ? (
                    <Ionicons
                      style={{ marginVertical: 15, marginLeft: 15 }}
                      name="eye-off"
                      size={25}
                      color={colors.muted}
                    />
                  ) : (
                    <Ionicons
                      style={{ marginVertical: 15, marginLeft: 15 }}
                      name="eye"
                      size={25}
                      color="black"
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          <View style={styles.buttomContainer}>
            <CustomButton text={"Sign up"} onPress={signUpHandle} />
          </View>
          <View style={styles.bottomContainer}>
            <Text>Already have an account?</Text>
            <Text
              onPress={() => navigation.navigate("drawers")}
              style={styles.signupText}
            >
              Login
            </Text>
          </View>
        </KeyboardAvoidingView>
      </InternetConnectionAlert>
    </ImageBackground>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flexDirecion: "row",
    // backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    flex: 1,
  },
  TopBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  welconeContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "15%",
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
  logo: {
    resizeMode: "contain",
    width: 80,
  },
  forgetPasswordContainer: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  ForgetText: {
    fontSize: 15,
    fontWeight: "600",
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
  signupText: {
    marginLeft: 2,
    color: colors.primary,
    fontSize: 15,
    fontWeight: "600",
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
  },
  screenNameParagraph: {
    marginTop: 5,
    fontSize: 15,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});
