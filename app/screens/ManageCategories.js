import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  ToastAndroid,
  Platform,
  AlertIOS,
  ActivityIndicator,
  Text,
  FlatList,
} from "react-native";
import SubmitButton from "../components/Button/SubmitButton";
import AppTextInput from "../components/Auth/AppTextInput";
import ModalTopInfor from "../components/ModalTopInfor";
import Modal from "react-native-modal";
import Header from "../components/Header";
import SubHeader from "../components/SubHeader";
import ListItems from "../components/ListItems";
import ListActions from "../components/ListActions";
import colors from "../config/colors";
import moment from "moment";
import axios from "axios";

function ManageCategories({ navigation }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    showCategories();
  }, [success]);

  const showCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/category`);
      setCategories(data.category);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (!name) {
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravityAndOffset(
          "Name Field is required",
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
      const { data } = await axios.post(`/api/admin/category`, {
        name,
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
      setName("");
      // setModalVisible(false);
      setSuccess(false);
    } catch (err) {
      // console.log(err);
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

  const handleDelete = async (index) => {
    try {
      setLoading(true);

      let allCategories = categories;
      const removed = allCategories.splice(index, 1);
      setCategories(allCategories);
      const { data } = axios.delete(`/api/admin/category/${removed[0]._id}`);
      setLoading(false);
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
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravityAndOffset(
          err,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      } else {
        AlertIOS.alert(err);
      }
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      showCategories();
      setRefreshing(false);
    }, 2000);
  };

  return (
    <>
      <Header navigation={navigation} HeaderTitle="Manage Categories" />
      <SubHeader buttonTitle="+ ADD CATEGORY" onPress={toggleModal} />
      <FlatList
        data={categories}
        keyExtractor={(categories) => categories._id.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item, index }) => (
          <View
            style={{
              backgroundColor: "white",
              elevation: 2,
              marginBottom: 5,
            }}
          >
            <ListItems
              mainTitleText="Name:"
              dateTitle="Created Date:"
              mainTitle={item.name}
              subSubTitle={`${moment(item && item.createdAt).format("LL")} `}
              rightContent={(reset) => (
                <ListActions
                  icon={"delete-empty"}
                  onPress={() => (handleDelete(index), reset())}
                />
              )}
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
          <ModalTopInfor title="+ ADD CATEGORY" handlePress={toggleModal} />
          <AppTextInput
            autoCapitalize="words"
            autoCorrect={false}
            icon="pencil-plus"
            placeholder="Enter name"
            value={name}
            setValue={setName}
          />

          <SubmitButton title="Save" onPress={handleSubmit} loading={loading} />
        </View>
      </Modal>
    </>
  );
}

export default ManageCategories;

const styles = StyleSheet.create({});
