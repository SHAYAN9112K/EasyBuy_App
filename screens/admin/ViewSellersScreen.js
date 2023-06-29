import {
    StyleSheet,
    Text,
    StatusBar,
    View,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import { colors, network } from "../../constants";
  import { Ionicons } from "@expo/vector-icons";
  import { AntDesign } from "@expo/vector-icons";
  import CustomAlert from "../../components/CustomAlert/CustomAlert";
  import CustomInput from "../../components/CustomInput/";
  import ProgressDialog from "react-native-progress-dialog";
  import UserList from "../../components/UserList/UserList";
  import AdminUserList from "../../components/AdminUserList/AdminUserList";
  
  const ViewSellersScreen = ({ navigation, route }) => {
    const [name, setName] = useState("");
    const { authUser } = route.params;
    const [user, setUser] = useState({});
    const [isloading, setIsloading] = useState(false);
    const [refeshing, setRefreshing] = useState(false);
    const [alertType, setAlertType] = useState("error");
    const [label, setLabel] = useState("Loading...");
    const [error, setError] = useState("");
    const [users, setUsers] = useState([]);
    const [foundItems, setFoundItems] = useState([]);
    const [filterItem, setFilterItem] = useState("");
  
    //method to convert the authUser to json object
    const getToken = (obj) => {
      try {
        setUser(JSON.parse(obj));
      } catch (e) {
        setUser(obj);
        return obj.token;
      }
      return JSON.parse(obj).token;
    };
  
    //method the fetch the users from server using API call
    const fetchUsers = () => {
      var myHeaders = new Headers();
      myHeaders.append("x-auth-token", getToken(authUser));
  
      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      setIsloading(true);
      fetch(`${network.serverip}/admin/sellers`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.success) {
            setUsers(result.data);
            setFoundItems(result.data);
            setError("");
          } else {
            setError(result.message);
          }
          setIsloading(false);
        })
        .catch((error) => {
          setIsloading(false);
          setError(error.message);
          console.log("error", error);
        });
    };
  
    //method call on pull refresh
    const handleOnRefresh = () => {
      setRefreshing(true);
      fetchUsers();
      setRefreshing(false);
    };
  
    //method to filer the orders for by title [search bar]
    const filter = () => {
      const keyword = filterItem;
      if (keyword !== "") {
        const results = users.filter((user) => {
          return user.name.toLowerCase().includes(keyword.toLowerCase());
        });
  
        setFoundItems(results);
      } else {
        setFoundItems(users);
      }
      setName(keyword);
    };

    const handleDeletePerson = (item) => {
      setIsloading(true);
      console.log(`${network.serverip}/admin/person?id=${item._id}`);
      fetch(`${network.serverip}/admin/person?id=${item._id}`,{
        method: 'DELETE'
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.success) {
            fetchUsers();
            setError(result.message);
            setAlertType("success");
          } else {
            setError(result.message);
            setAlertType("error");
          }
          setIsloading(false);
        })
        .catch((error) => {
          setIsloading(false);
          setError(error.message);
          console.log("error", error);
        });
    };

    const handleBan = async (selectedRider) => {
      setIsloading(true);
  
      var myHeaders1 = new Headers();
      myHeaders1.append("x-auth-token", authUser.token);
      myHeaders1.append("Content-Type", "application/json");
  
      var raw1 = JSON.stringify({
        accountStatus:"ban"
      });
  
      var requestOptions1 = {
        method: "PATCH",
        headers: myHeaders1,
        body: raw1,
        redirect: "follow",
      };
  
      await fetch(
        `${network.serverip}/admin/banPerson?id=${selectedRider._id}`,
        requestOptions1
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.success == true) {
            setIsloading(false);
            setError(result.message);
            setAlertType("success");
            fetchUsers();
            
          }
        })
        .catch((error) => {
          setIsloading(false);
          setError(error.message);
          console.log("errorss", error);
        });
    }
  
    const handleUnBan = async (selectedRider) => {
      setIsloading(true);
  
      var myHeaders1 = new Headers();
      myHeaders1.append("x-auth-token", authUser.token);
      myHeaders1.append("Content-Type", "application/json");
  
      var raw1 = JSON.stringify({
        accountStatus:"active"
      });
  
      var requestOptions1 = {
        method: "PATCH",
        headers: myHeaders1,
        body: raw1,
        redirect: "follow",
      };
  
      await fetch(
        `${network.serverip}/admin/UnbanPerson?id=${selectedRider._id}`,
        requestOptions1
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.success == true) {
            setIsloading(false);
            setError(result.message);
            setAlertType("success");
            fetchUsers();
           
          }
        })
        .catch((error) => {
          setIsloading(false);
          setError(error.message);
          console.log("errorss", error);
        });
    }
  
    //filter the data whenever filteritem value change
    useEffect(() => {
      filter();
    }, [filterItem]);
  
    //fetch the orders on initial render
    useEffect(() => {
      fetchUsers();
    }, []);
  
    const alerthello=()=>{
      alert("jhello")
    }
  
    return (
      <View style={styles.container}>
        <ProgressDialog visible={isloading} label={label} />
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
          <TouchableOpacity disabled>
            <AntDesign name="user" size={25} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.screenNameContainer}>
          <View>
            <Text style={styles.screenNameText}>View Users</Text>
          </View>
          <View>
            <Text style={styles.screenNameParagraph}>View all Users</Text>
          </View>
        </View>
        <CustomAlert message={error} type={alertType} />
        <CustomInput
          radius={5}
          placeholder={"Search..."}
          value={filterItem}
          setValue={setFilterItem}
        />
        <ScrollView
          style={{ flex: 1, width: "100%" }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refeshing} onRefresh={handleOnRefresh} />
          }
        >
          {foundItems && foundItems.length == 0 ? (
            <Text>{`No user found with the name of ${filterItem}!`}</Text>
          ) : (
            foundItems.map((item, index) => (
              <View style={styles.container1}>
              <AdminUserList
                key={Math.random()}
                username={item?.name}
                email={item?.email}
                usertype={item?.userType}
              // onPress={{}}
              />
              <View style={{flexDirection:'row', justifyContent:"space-evenly"}}>
              {/* <TouchableOpacity style={styles.actionButton} onPress={() => handleSend(item)}>
                <Text style={{ color: colors.white }}>Products</Text>
              </TouchableOpacity> */}
              {item?.accountStatus=="ban"?
              <TouchableOpacity style={styles.actionButton} onPress={() => handleUnBan(item)}>
              <Text style={{ color: colors.white }}>Un Ban</Text>
            </TouchableOpacity>
              :
              <TouchableOpacity style={styles.actionButton} onPress={() => handleBan(item)}>
                <Text style={{ color: colors.white }}>Ban</Text>
              </TouchableOpacity>
              }
              <TouchableOpacity style={styles.actionButton} onPress={() => handleDeletePerson(item)}>
                <Text style={{ color: colors.white }}>Delete</Text>
              </TouchableOpacity>
              </View>
            </View>
            ))
          )}
        </ScrollView>
      </View>
    );
  };
  
  export default ViewSellersScreen;
  
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
    formContainer: {
      flex: 2,
      justifyContent: "flex-start",
      alignItems: "center",
      display: "flex",
      width: "100%",
      flexDirecion: "row",
      padding: 5,
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
      elevation: 2,
      marginLeft: 10,
      marginRight: 10,
      margin: 5,
      padding: 5
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
  