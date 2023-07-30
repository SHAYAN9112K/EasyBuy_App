import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  StatusBar,
  Text,
  ScrollView,
  RefreshControl,
  // Input,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import cartIcon from "../../assets/icons/cart_beg.png";
import { useSelector, useDispatch } from "react-redux";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
// import { addReview } from "../../../EasyBuy_Backend/controllers/user/review";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OrderList from "../../components/OrderList/OrderList";
// import { color } from "react-native-reanimated";

const Reviews = ({ navigation, route }) => {
  const { product } = route.params;
  const cartproduct = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [allReviews, setAllReviews] = useState([]);
  const [functionCalled, setFunctionCalled] = useState(false);
  const [refeshing, setRefreshing] = useState(false);

  const handleOnRefresh = () => {
    setRefreshing(true);
    sending();
    setRefreshing(false);
  };
  //   useEffect(async () => {
  // const abc = product?._id;
  //   alert(abc);

  const sending = async () => {
    try {
      const value = await AsyncStorage.getItem("authUser"); // get authUser from async storage
      let users = JSON.parse(value);
      var myHeaders = new Headers();
      // myHeaders.append("x-auth-token", authUser.token);
      //   myHeaders.append("x-auth-token", getToken(authUser));
      myHeaders.append("x-auth-token", users.token);

      //   myHeaders.append("Content-Type", "application/json");
      // var raw = JSON.stringify({
      //   product: product?._id,
      // });
      //   const queryParams = new URLSearchParams({ product: product?._id }); // Add the desired query parameters here
      const abc = JSON.stringify({ product: product?._id });
      //   alert(abc);

      var reqOtion = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(`${network.serverip}/get-review?id=${product._id}`, reqOtion)
        .then((response) => response.json())
        .then((result) => {
          if (result.data == null) {
            setIsButtonEnabled(false);
          } else {
            setIsButtonEnabled(true);
          }
        })
        .catch((error) => {
          //   setIsloading(false);
          setError(error.message);
          setAlertType("error");
          alert("wronggg");

          console.log("error", error);
        });

      var requestsOptions = {
        method: "GET",
        headers: myHeaders,
        //   body: raw,
        redirect: "follow",
      };
      // "64a546cf6df77b5d99270b64";
      //   const id = "64";

      fetch(`${network.serverip}/all-review?id=${product._id}`, requestsOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.success == true) {
            setAllReviews(result.data);
            // alert(allReviews);

            //   setAllReviews(result.data);
            setError("");
            //   result.categories.forEach((cat) => {
            //       let obj = {
            //           label: cat.title,
            //           value: cat._id,
            //       };
            //   })
            //   setIsloading(false);
            setAlertType("success");
            // alert("done");
            setError(result.message);
          }
        })
        .catch((error) => {
          //   setIsloading(false);
          setError(error.message);
          setAlertType("error");
          alert(error.message);

          console.log("error", error);
        });
    } catch (error) {
      // setIsloading(false);
      setError(error.message);
      setAlertType("error");
      console.log("error", error);
      //   }
    }
  };
  useEffect(() => {
    sending();
  }, []);
  // sending();

  // alert("hello123");
  //   }, []);

  //   const value = await AsyncStorage.getItem("authUser"); // get authUser from async storage
  //   let users = JSON.parse(value);

  //   const { authUser } = AsyncStorage.getItem("authUser");
  //   var raw = JSON.stringify({
  //     review: review,
  //   });

  const getToken = (obj) => {
    try {
      setUser(JSON.parse(obj));
    } catch (e) {
      setUser(obj);
      return obj.token;
    }
    return JSON.parse(obj).token;
  };

  //   var myHeaders = new Headers();
  //   // myHeaders.append("x-auth-token", authUser.token);
  //   //   myHeaders.append("x-auth-token", getToken(authUser));
  //   myHeaders.append("x-auth-token", users.token);

  //   myHeaders.append("Content-Type", "application/json");

  //   const { product } = route.params;
  const [review, setReview] = useState({});
  //   var requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: "follow",
  //   };
  const addReview = async () => {
    // const cartproduct = useSelector((state) => state.product);

    const value = await AsyncStorage.getItem("authUser"); // get authUser from async storage
    let users = JSON.parse(value);
    var myHeaders = new Headers();
    // myHeaders.append("x-auth-token", authUser.token);
    //   myHeaders.append("x-auth-token", getToken(authUser));
    myHeaders.append("x-auth-token", users.token);

    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      review: review,
      product: product?._id,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${network.serverip}/add-review`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success == true) {
          //   setIsloading(false);
          setAlertType("success");
          alert("Your review Added!!");
          setError(result.message);
        }
      })
      .catch((error) => {
        setIsloading(false);
        setError(error.message);
        setAlertType("error");
        alert("not done");

        console.log("error", error);
      });
    setFunctionCalled(true);
    sending();
    setReview("");
    // alert(product?._id);
    // setFunctionCalled(true);

    // useEffect();
    // alert("hello123");
  };

  //       if (result.success) {
  //       }
  //     });

  return (
    <ScrollView
      style={{ flex: 1, width: "100%", padding: 20 }}
      showsVerticalScrollIndicator={false}
      //   style={styles.container}
    >
      <StatusBar></StatusBar>
      <View style={styles.topBarContainer}>
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

        <View></View>
        <TouchableOpacity
          style={styles.cartIconContainer}
          onPress={() => navigation.navigate("cart")}
        >
          {cartproduct.length > 0 ? (
            <View style={styles.cartItemCountContainer}>
              <Text style={styles.cartItemCountText}>{cartproduct.length}</Text>
            </View>
          ) : (
            <></>
          )}
          <Image source={cartIcon} />
        </TouchableOpacity>
      </View>
      <Text>Reviews</Text>
      {/* alert(allReviews) */}

      {allReviews.length == 0 ? (
        <View style={styles.ListContiainerEmpty}>
          <Text style={styles.secondaryTextSmItalic}>
            "There are no Reviews placed yet."
          </Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1, width: "100%", padding: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refeshing}
              onRefresh={handleOnRefresh}
            />
          }
        >
          {allReviews.map((review, index) => {
            return (
              <View style={styles.container1} key={index}>
                <Text>Title:{review.product.title}</Text>
                <Text>Review: {review.reviews}</Text>
                <Text>User:{review.user.name}</Text>
                <Text>Email:{review.user.email}</Text>
              </View>
              //   <OrderList item={review} key={index} onPress={() => abc} />
            );
          })}
          <View style={styles.emptyView}></View>
        </ScrollView>
      )}
      <View style={styles.productButtonContainer}>
        <CustomInput
          value={review}
          setValue={setReview}
          placeholder={"Add your review here!"}
          //   keyboardType={"number-pad"}
          placeholderTextColor={colors.muted}
          radius={5}
        />
        <CustomButton
          text={"Add Reviews"}
          onPress={addReview}
          disabled={!isButtonEnabled}
        />
        {/* <CustomButton text={"View reviews"} onPress={sending} /> */}
      </View>
    </ScrollView>
  );
};
export default Reviews;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
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
  productButtonContainer: {
    marginTop: 40,
    marginBottom: 50,
    padding: 20,
    paddingLeft: 40,
    paddingRight: 40,
    // backgroundColor: colors.red,
    width: "100%",
    height: 100,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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
