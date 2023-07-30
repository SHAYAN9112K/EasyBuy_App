import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const SellerReveiwScreen = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [allReviews, setAllReviews] = useState([]);
  const { product, authUser } = route?.params;
  useEffect(() => {
    Getdata();
  }, []);

  const Getdata = () => {
    var myHeaders = new Headers();
    myHeaders.append("x-auth-token", authUser.token);
    //   myHeaders.append("x-auth-token", getToken(authUser));
    // myHeaders.append("x-auth-token", users.token);

    myHeaders.append("Content-Type", "application/json");
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
  };

  return (
    <View>
      <Text style={styles.screenNameText}>Review</Text>

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
          //   refreshControl={
          //     <RefreshControl
          //       refreshing={refeshing}
          //       onRefresh={handleOnRefresh}
          //     />
          //   }
        >
          {allReviews.map((review, index) => {
            return (
              <View key={index}>
                <Text>{review.reviews}</Text>
              </View>
              //   <OrderList item={review} key={index} onPress={() => abc} />
            );
          })}
          <View style={styles.emptyView}></View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
  },
});
export default SellerReveiwScreen;
