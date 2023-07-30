import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import UserProfileCard from "../../components/UserProfileCard/UserProfileCard";
import { Ionicons } from "@expo/vector-icons";
import OptionList from "../../components/OptionList/OptionList";
import { colors } from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import profilePlaceholder from "../../assets/profilePlaceholder/profilePlaceholder.png";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "../../components/CustomButton";

const UserProfileScreen = ({ navigation, route }) => {
  const [userInfo, setUserInfo] = useState({});
  const { user } = route.params;
  const [image, setImage] = useState("");
  const [isloading, setIsloading] = useState(false);

  const [img, setImg] = useState("random");
  const convertToJSON = (obj) => {
    try {
      setUserInfo(JSON.parse(obj));
    } catch (e) {
      setUserInfo(obj);
    }
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    console.log("helppp");
    if (!result.cancelled) {
      console.log(result);
      setImage(result.uri);
      upload();
    }
  };

  const upload = async () => {
    console.log("upload-F:", image);

    var formdata = new FormData();
    formdata.append("photos", image, "product.png");

    var ImageRequestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch(
      "https://api-easybuy.herokuapp.com/photos/upload",
      ImageRequestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log("error", error));
  };

  const addProductHandle = async () => {
    setIsloading(true);
    console.log("Helpppp");
    var myHeaders = new Headers();
    const value = await AsyncStorage.getItem("authUser");
    let user = JSON.parse(value);
    myHeaders.append("x-auth-token", user.token);
    myHeaders.append("Content-Type", "application/json");

    console.log("Helpppp222");

    console.log(user._id);
    var raw = JSON.stringify({
      image: image,
    });

    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    //[check validation] -- Start

    //[check validation] -- End
    fetch(`${network.serverip}/addProfile-pic?id=${user._id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success == true) {
          setIsloading(false);
          setAlertType("success");
          setError(result.message);
        }
      })
      .catch((error) => {
        setIsloading(false);
        setError(error.message);
        setAlertType("error");
        console.log("error", error);
      });
  };
  const getData = async () => {
    setIsloading(true);
    console.log("Helpppp");
    var myHeaders = new Headers();
    const value = await AsyncStorage.getItem("authUser");
    let user = JSON.parse(value);
    myHeaders.append("x-auth-token", user.token);
    myHeaders.append("Content-Type", "application/json");

    console.log("Helpppp222");

    console.log(user._id);
    // var raw = JSON.stringify({
    //   image: image,
    // });

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    //[check validation] -- Start

    //[check validation] -- End
    fetch(`${network.serverip}/getProfile-pic?id=${user._id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("hrlpppp");
        console.log(result);
        if (result.success == true) {
          setIsloading(false);
          console.log("Helloo" + result.data.image);
          setImage(result.data.image);
          setAlertType("success");
          setError(result.message);
        } else {
          console.log("Hellloooo33");
        }
      })
      .catch((error) => {
        setIsloading(false);
        setError(error.message);
        setAlertType("error");
        console.log("error", error);
      });
  };

  //api-easybuy.herokuapp.com/photos/upload

  // const getRandomImage=async()=>{
  //   await fetch('https://randomuser.me/api/')
  //   .then(response => response.json())
  //   .then(data => {
  //     // Use the data from the API
  //     console.log(data.results[0].picture.large);
  //     setImg(data.results[0].picture.large)
  //   })
  //   .catch(error => {
  //     // Handle errors
  //     console.error(error);
  //   });
  // }

  // covert  the user to Json object on initial render
  https: useEffect(() => {
    getData();
    convertToJSON(user);
    // getRandomImage();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="auto"></StatusBar>
      <View style={styles.TopBarContainer}>
        <TouchableOpacity>
          <Ionicons name="menu-sharp" size={30} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.screenNameContainer}>
        <Text style={styles.screenNameText}>Profile</Text>
      </View>
      <View style={styles.Container}>
        <View style={styles.avatarContainer}>
          {image == "abc" ? (
            <TouchableOpacity style={styles.imageHolder1} onPress={pickImage}>
              {/* <Ionicons name="pluscircle" size={30} color={colors.primary} /> */}

              <AntDesign name="pluscircle" size={30} color={colors.muted} />
              {/* <Text>Click here to add picr</Text> */}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.imageHolder} onPress={pickImage}>
              <Image
                source={{ uri: image }}
                style={{ width: 140, height: 100 }}

                // {{ width: "100%", height: "100%" }}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.usernameText}>{userInfo?.name}</Text>
          <Text style={styles.secondaryText}>{userInfo?.email}</Text>
        </View>
      </View>
      {/* <View style={styles.UserProfileCardContianer}> */}
      {/* <UserProfileCard
          // img={image}
          name={userInfo?.name}
          email={userInfo?.email}
        /> */}
      {/* </View> */}
      <CustomButton text={"Add Image"} onPress={addProductHandle} />

      <View style={styles.OptionsContainer}>
        <OptionList
          text={"My Account"}
          Icon={Ionicons}
          iconName={"person"}
          onPress={() =>
            navigation.navigate("myaccount", { user: userInfo, img: img })
          }
        />
        <OptionList
          text={"Wishlist"}
          Icon={Ionicons}
          iconName={"heart"}
          onPress={() => navigation.navigate("mywishlist", { user: userInfo })}
        />
        <OptionList
          text={"Upload"}
          Icon={Ionicons}
          iconName={"heart"}
          onPress={() => navigation.navigate("mywishlist", { user: userInfo })}
        />
        {/* !For future use --- */}
        {/* <OptionList
          text={"Settings"}
          Icon={Ionicons}
          iconName={"settings-sharp"}
          onPress={() => console.log("working....")}
        />
        <OptionList
          text={"Help Center"}
          Icon={Ionicons}
          iconName={"help-circle"}
          onPress={() => console.log("working....")}
        /> */}
        {/* !For future use ---- End */}
        <OptionList
          text={"Logout"}
          Icon={Ionicons}
          iconName={"log-out"}
          onPress={async () => {
            await AsyncStorage.removeItem("authUser");
            navigation.replace("drawers");
          }}
        />
      </View>
    </View>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
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
  UserProfileCardContianer: {
    width: "100%",
    height: "25%",
  },
  screenNameContainer: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
  },
  OptionsContainer: {
    width: "100%",
  },
  avatarContainer: {
    display: "flex",
    width: "40%",
    marginLeft: 20,
    marginBottom: 40,
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: colors.primary_light,
    borderRadius: 20,
  },
  infoContainer: {
    marginLeft: 20,
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
  Container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  imageHolder1: {
    height: 50,
    width: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light,
    borderRadius: 10,
    elevation: 5,
  },
});
