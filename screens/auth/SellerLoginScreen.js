import {
  StyleSheet,
  Image,
  Text,
  View,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground
} from "react-native";

import React, { useState } from "react";
import { colors, network } from "../../constants";
import CustomInput from "../../components/CustomInput";
import PasswordInput from "../../components/PasswordInput";
import header_logo from "../../assets/logo/logo.png";
import CustomButton from "../../components/CustomButton";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import ProgressDialog from "react-native-progress-dialog";
import InternetConnectionAlert from "react-native-internet-connection-alert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
const { width, height } = Dimensions.get('window');
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isloading, setIsloading] = useState(false);
  const [passShow, setPassShow] = useState(true);

  //method to store the authUser to aync storage
  _storeData = async (user) => {
    try {
      AsyncStorage.setItem("authUser", JSON.stringify(user));
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    email: email,
    password: password,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  //method to validate the user credentials and navigate to Home Screen / Dashboard
  const loginHandle = () => {
    setIsloading(true);
    //[check validation] -- Start
    // if email does not contain @ sign
    if (email == "") {
      setIsloading(false);
      return setError("Please enter your email");
    }
    if (password == "") {
      setIsloading(false);
      return setError("Please enter your password");
    }
    if (!email.includes("@")) {
      setIsloading(false);
      return setError("Email is not valid");
    }
    // length of email must be greater than 5 characters
    if (email.length < 6) {
      setIsloading(false);
      return setError("Email is too short");
    }
    // length of password must be greater than 5 characters
    if (password.length < 6) {
      setIsloading(false);
      return setError("Password must be 6 characters long");
    }
    //[check validation] -- End

    fetch(network.serverip + "/login", requestOptions) // API call
      .then((response) => response.json())
      .then((result) => {
        if (
          result.status == 200 ||
          (result.status == 1 && result.success != false)
        ) {
          if (result?.data?.userType == "USER") {
            //check the user type if the type is ADMIN then navigate to Dashboard else navigate to User Home
            setIsloading(false);
            return setError("You are not an SELLER please navigate to USER Login");
          }
          if (result?.data?.userType == "RIDER") {
            //check the user type if the type is ADMIN then navigate to Dashboard else navigate to User Home
            setIsloading(false);
            return setError("You are not an SELLER please navigate to RIDER Login");
          }
          if (result?.data?.userType == "ADMIN") {
            //check the user type if the type is ADMIN then navigate to Dashboard else navigate to User Home
            setIsloading(false);
            return setError("You are not an SELLER please navigate to ADMIN Login");
          }
          if (result?.data?.userType == "SELLER") {
            if (result?.data?.accountStatus == "ban") {
              setIsloading(false);
              return setError("You are Currently Banned by Admin");
            }
            _storeData(result.data);
            setIsloading(false);
            navigation.replace("SellerDashboardScreen", { authUser: result.data });
          }
        } else {
          setIsloading(false);
          return setError("sdsds"+result.message);
        }
      })
      .catch((error) => {
        setIsloading(false);
        console.log("error", setError(error.message));
      });
  };

  return (
    <ImageBackground
      source={require('../../image/backgroundImg.jpg')}
      style={styles.background}
      opacity={0.5}
    >
    <InternetConnectionAlert onChange={(connectionState) => {}}>
      <KeyboardAvoidingView
        // behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView style={{ flex: 1, width: "100%" }}>
          <ProgressDialog visible={isloading} label={"Login ..."} />
          <StatusBar></StatusBar>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
      <Ionicons name="menu-outline" size={24} color="black" />
    </TouchableOpacity>
          <View style={styles.welconeContainer}>
            <View>
              <Text style={styles.welcomeText}>Welcome to Swift Multiservice</Text>
              <Text style={styles.welcomeParagraph}>
                make your ecommerce easy
              </Text>
            </View>
            <View>
              <Image style={styles.logo} source={header_logo} />
            </View>
          </View>
          <View style={styles.screenNameContainer}>
            <Text style={styles.screenNameText}>Seller Login</Text>
          </View>
          <View style={styles.formContainer}>
            <CustomAlert message={error} type={"error"} />
            <CustomInput
              value={email}
              setValue={setEmail}
              placeholder={"Username"}
              placeholderTextColor={colors.muted}
              radius={5}
            />
            <View style={{flexDirection:"row" ,justifyContent:"space-between" }}>
            <PasswordInput
              value={password}
              setValue={setPassword}
              secureTextEntry={passShow}
              placeholder={"Password"}
              placeholderTextColor={colors.muted}
              radius={5}
            />
            <TouchableOpacity onPress={()=>{setPassShow(!passShow)}}>
            {passShow
            ?
            <Ionicons style={{marginVertical:15,marginLeft:15}} name="eye-off" size={25} color={colors.muted} />
            :
            <Ionicons style={{marginVertical:15,marginLeft:15}} name="eye" size={25} color={colors.muted} />
            }
            
            </TouchableOpacity>
            </View>
            <View style={styles.forgetPasswordContainer}>
              <Text
                onPress={() => navigation.navigate("forgetpassword")}
                style={styles.ForgetText}
              >
                Forget Password?
              </Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.buttomContainer}>
          <CustomButton text={"Login"} onPress={loginHandle} />
        </View>
        <View style={styles.bottomContainer}>
          <Text>Don't have an account?</Text>
          <Text
            onPress={() => navigation.navigate("signup")}
            style={styles.signupText}
          >
            signup
          </Text>
        </View>
      </KeyboardAvoidingView>
    </InternetConnectionAlert>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirecion: "row",
    // backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    flex: 1,
  },
  welconeContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: "30%",
    // padding:15
  },
  formContainer: {
    flex: 3,
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
  welcomeText: {
    fontSize: 42,
    fontWeight: "bold",
    color: colors.muted,
  },
  welcomeParagraph: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.primary_shadow,
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
    display: "flex",
    justifyContent: "center",
    width: width-40,
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
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
