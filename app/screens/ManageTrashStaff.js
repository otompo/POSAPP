import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  RefreshControl,
  FlatList,
  ToastAndroid,
  Platform,
  AlertIOS,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import colors from "../config/colors";
import { Divider } from "react-native-elements";
import UserFormList from "../components/UserFormList";
import ListActions from "../components/ListActions";
import moment from "moment";
import Header from "../components/Header";

function ManageTrashStaff({ navigation }) {
  const [success, setSuccess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [totalInactive, setTotalInactive] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsersInTrash();
    getTotalUsersInActive();
    if (totalInactive === 0) navigation.navigate("ManageStaff");
  }, [success]);

  const getAllUsersInTrash = async () => {
    try {
      const { data } = await axios.get(`/api/admin/users/trash`);
      setUsers(data);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const getTotalUsersInActive = async () => {
    try {
      const { data } = await axios.get(`/api/admin/users/inactive`);
      setTotalInactive(data);
    } catch (err) {
      console.log(err.response.data.message);
      // toast.error(err.response.data.message);
    }
  };

  const moveUserFromTrash = async (e, username) => {
    try {
      setSuccess(true);
      const { data } = await axios.patch(`/api/admin/users/trash/${username}`);
      setSuccess(false);
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravityAndOffset(
          "success",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      } else {
        AlertIOS.alert("success");
      }
    } catch (err) {
      console.log(err.response.data.message);
      setSuccess(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      getTotalUsersInActive();
      getAllUsersInTrash();
      setRefreshing(false);
    }, 2000);
  };

  return (
    <>
      <Header navigation={navigation} HeaderTitle="In Active Staff" />
      <View style={styles.topContainer}>
        <Text style={styles.topText}> In Active Staff</Text>
        <View
          style={{
            height: 30,
            width: 30,
            borderRadius: 15,
            backgroundColor: colors.primary,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("ManageStaff")}>
            <Text style={{ color: colors.white, fontWeight: "500" }}>
              {totalInactive}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={users}
        keyExtractor={(user, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "white",
              elevation: 2,
              marginBottom: 5,
            }}
          >
            <UserFormList
              userName={item.name}
              userContact={item.contactNum}
              userEmail={item.email}
              userGeneratedPass={item.generatedPasword}
              userCreatedAt={`${moment(item && item.createdAt).fromNow()} `}
              renderRightActions={() => (
                <ListActions
                  bcolor="online"
                  icon={"reload"}
                  onPress={(e) => moveUserFromTrash(e, item.username)}
                />
              )}
            />
            <Divider />
          </View>
        )}
      />
    </>
  );
}

export default ManageTrashStaff;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "space-between",
  },

  topContainer: {
    height: 50,
    backgroundColor: colors.toolbar,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  topText: {
    color: colors.dark,
    fontSize: 18,
    fontWeight: "300",
    textTransform: "uppercase",
  },
});
