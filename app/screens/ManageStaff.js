import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  ToastAndroid,
  Platform,
  AlertIOS,
  ActivityIndicator,
  FlatList,
} from "react-native";
import SubmitButton from "../components/Button/SubmitButton";
import AppTextInput from "../components/Auth/AppTextInput";
import ModalTopInfor from "../components/ModalTopInfor";
import Modal from "react-native-modal";
import Header from "../components/Header";
import UserListItems from "../components/UserListItems";
import moment from "moment";
import ListActions from "../components/ListActions";
import SubHeader from "../components/SubHeader";
import colors from "../config/colors";
import axios from "axios";

function ManageStaff({ navigation }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [totalInactive, setTotalInactive] = useState("");
  const [contactNum, setContactNum] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    loadAllUsers();
    getTotalUsersInActive();
  }, [success]);

  const handleSubmit = async (e) => {
    if (!name || !email || !contactNum) {
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravityAndOffset(
          "All fields are required",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      } else {
        AlertIOS.alert("All fields are required");
      }

      return;
    }
    try {
      setSuccess(true);
      const { data } = await axios.post(`/api/admin/users`, {
        name,
        email,
        contactNum,
      });

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
      setModalVisible(false);
      setName("");
      setEmail("");
      setContactNum("");
      setSuccess(false);
    } catch (err) {
      // console.log(err.response.data.message);
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravityAndOffset(
          err.response.data.message,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      } else {
        AlertIOS.alert(err.response.data.message);
      }
      setSuccess(false);
    }
  };

  const loadAllUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/users`);
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  const getTotalUsersInActive = async () => {
    try {
      // setSuccess(true);
      const { data } = await axios.get(`/api/admin/users/inactive`);
      setTotalInactive(data);
      // setSuccess(false);
    } catch (err) {
      console.log(err.response.data.message);
      // setSuccess(false);
    }
  };
  const moveUserToTrash = async (e, username) => {
    try {
      setSuccess(true);
      const { data } = await axios.put(`/api/admin/users/trash/${username}`);
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

  const makeUserAnAdmin = async (e, username) => {
    try {
      setSuccess(true);
      const { data } = await axios.put(`/api/admin/users/makeuser/${username}`);
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

  const removeUserAsAdmin = async (e, username) => {
    try {
      setSuccess(true);
      const { data } = await axios.patch(
        `/api/admin/users/makeuser/${username}`
      );
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
      // toast.error(err.response.data.message);
      setSuccess(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadAllUsers();
      getTotalUsersInActive();
      setRefreshing(false);
    }, 2000);
  };

  // if (loading) {
  //   return (
  //     <View
  //       style={{
  //         alignItems: "center",
  //         backgroundColor: "#fff",
  //         height: "100%",
  //         justifyContent: "center",
  //       }}
  //     >
  //       <ActivityIndicator size="large" color={colors.primary} />
  //     </View>
  //   );
  // }
  return (
    <>
      <Header navigation={navigation} HeaderTitle="Manage Staff" />
      <SubHeader
        buttonTitle="+ ADD STAFF"
        subTitle="Total InActive"
        data={JSON.stringify(totalInactive)}
        onPress={toggleModal}
      />

      <FlatList
        data={users}
        keyExtractor={(users) => users._id.toString()}
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
            <UserListItems
              color={
                item.role.includes("admin") ? colors.infor : colors.airblue
              }
              icon={item.role.includes("admin") ? "lock-open-variant" : "lock"}
              userName={item.name}
              userContact={item.contactNum}
              userEmail={item.email}
              userGeneratedPass={item.generatedPasword}
              userCreatedAt={`${moment(item && item.createdAt).fromNow()} `}
              rightContent={(reset) => (
                <ListActions
                  icon={"delete-empty"}
                  onPress={(e) => (moveUserToTrash(e, item.username), reset())}
                />
              )}
              leftContent={(reset) =>
                item && item.role.includes("admin") ? (
                  <ListActions
                    bcolor="infor"
                    icon="account-lock-open-outline"
                    onPress={(e) => (
                      removeUserAsAdmin(e, item.username), reset()
                    )}
                  />
                ) : (
                  <ListActions
                    bcolor="airblue"
                    icon="account-lock-outline"
                    onPress={(e) => (
                      makeUserAnAdmin(e, item.username), reset()
                    )}
                  />
                )
              }
            />
          </View>
        )}
      />

      <Modal isVisible={isModalVisible}>
        <View
          style={{
            // flex: 1,
            color: colors.white,
            backgroundColor: colors.white,
            borderRadius: 5,
            padding: 10,
          }}
        >
          <ModalTopInfor title="+ ADD STAFF" handlePress={toggleModal} />
          <AppTextInput
            autoCapitalize="words"
            autoCorrect={false}
            icon="pencil-plus"
            placeholder="Enter full name"
            value={name}
            setValue={setName}
          />
          <AppTextInput
            autoCapitalize="none"
            autoCorrect={false}
            icon="email"
            placeholder="Enter email"
            keyboardType="email-address"
            textContentType="emailAddress"
            value={email}
            setValue={setEmail}
          />
          <AppTextInput
            autoCapitalize="none"
            autoCorrect={false}
            icon="phone"
            placeholder="Phone Number"
            keyboardType="numeric"
            value={contactNum}
            setValue={setContactNum}
          />
          <SubmitButton title="Save" onPress={handleSubmit} loading={loading} />
        </View>
      </Modal>
    </>
  );
}

export default ManageStaff;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "space-between",
  },

  topContainer: {
    height: 60,
    backgroundColor: colors.toolbar,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 5,
    padding: 5,
  },

  topText: {
    color: colors.dark,
    fontSize: 18,
    fontWeight: "300",
    textTransform: "uppercase",
    marginLeft: 60,
  },
});
