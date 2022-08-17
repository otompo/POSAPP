import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  AlertIOS,
  Image,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import colors from "../config/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Text from "@kaloraat/react-native-text";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import SubmitButton from "../components/Button/SubmitButton";
import AppTextInput from "../components/Auth/AppTextInput";
import CircleLogo from "../components/Auth/CircleLogo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/authContext";
import Header from "../components/Header";
// import { Avatar } from "react-native-paper";
import moment from "moment";

const TopTabNavigator = createMaterialTopTabNavigator();

function AccountScreen({ navigation }) {
  const [auth, setAuth] = useContext(AuthContext);
  const [uploadImage, setUploadImage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNum, setContactNum] = useState("");
  const [image, setImage] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.user) {
      const { name, contactNum, email } = auth && auth.user;
      setName(name);
      setContactNum(contactNum);
      setEmail(email);
      // setImage(profle_image);
    }
  }, [auth]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await axios.put(`/api/user/updateprofile`, {
        name,
        email,
        contactNum,
      });

      if (auth?.user?._id === data._id) {
        setAuth({ ...auth, user: data });
        let fromLocalStorage = JSON.parse(await AsyncStorage.getItem("@auth"));
        // console.log("First", fromLocalStorage);
        fromLocalStorage.user = data;
        await AsyncStorage.setItem("@auth", JSON.stringify(fromLocalStorage));
        // console.log("SEC", fromLocalStorage);
      }

      if (Platform.OS === "android") {
        ToastAndroid.showWithGravityAndOffset(
          "Success",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      } else {
        AlertIOS.alert("Success");
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      // alert(err);
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    // console.log(permissionResult);
    if (permissionResult.granted !== true) {
      alert("Camera access is required");
      return;
    }
    // get image from user
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      // mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
      quality: 1,
    });
    // console.log(pickeResult);
    if (!pickerResult.cancelled) {
      let base64Image = `data:image/jpg;base64,${pickerResult.base64}`;
      // save image to state for preview
      // console.log(base64Image);
      setUploadImage(base64Image);
      // send to backend for uploading to clouldnary

      const { data } = await axios.post(`/api/upload-image`, {
        image: base64Image,
      });
      // console.log(data);
      // update user async storage
      const as = JSON.parse(await AsyncStorage.getItem("@auth"));
      // it has {user:{}, token}
      as.user = data;
      // console.log("UPDATED DATA", data);
      await AsyncStorage.setItem("@auth", JSON.stringify(data));
      // update  constext
      setState({ ...state, user: data });
      setImage(data.image);
      alert("Profile image saved successfully");
    }
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={100}
      enableOnAndroid={true}
      extraHeight={80}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        marginHorizontal: 5,
      }}
    >
      <ScrollView>
        <CircleLogo>
          {image && image.url ? (
            <Image
              source={{ uri: image.url }}
              style={{
                height: 150,
                width: 150,
                borderRadius: 100,
                marginVertical: 20,
              }}
            />
          ) : uploadImage ? (
            <Image
              source={{ uri: uploadImage }}
              style={{
                height: 150,
                width: 150,
                borderRadius: 100,
                marginVertical: 20,
              }}
            />
          ) : (
            <TouchableOpacity
            //  onPress={() => handleUpload()}
            >
              <MaterialCommunityIcons
                name="account"
                size={50}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}
        </CircleLogo>

        <View style={{ marginHorizontal: 30 }}>
          <AppTextInput
            autoCapitalize="words"
            autoCorrect={false}
            icon="account"
            placeholder="Enter your full name"
            value={name}
            setValue={setName}
          />
          <AppTextInput
            autoCapitalize="none"
            autoCorrect={false}
            icon="email"
            placeholder="Enter Email..."
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

          <SubmitButton
            title="Update"
            onPress={handleSubmit}
            loading={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

function PasswordScreen() {
  const [prevPassword, setPrevPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [c_password, setC_Password] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.put(`/api/user/updatepassword`, {
        prevPassword,
        newPassword,
        c_password,
      });
      setPrevPassword("");
      setNewPassword("");
      setC_Password("");
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravityAndOffset(
          "Success",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      } else {
        AlertIOS.alert("Success");
      }
      setLoading(false);
    } catch (err) {
      // console.log(err.response);
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
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={100}
      enableOnAndroid={true}
      extraHeight={80}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        marginHorizontal: 5,
      }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerLine}>
          <Text
            title
            center
            bold
            style={{
              textTransform: "uppercase",
            }}
          >
            Update Password
          </Text>
        </View>
        <AppTextInput
          autoCapitalize="none"
          autoCorrect={false}
          icon="lock"
          value={prevPassword.toString()}
          setValue={setPrevPassword}
          placeholder="Current Password"
          secureTextEntry
          textContentType="password"
          autoCompleteType="password"
        />
        <AppTextInput
          autoCapitalize="none"
          autoCorrect={false}
          icon="lock"
          value={newPassword.toString()}
          setValue={setNewPassword}
          placeholder="New Password"
          secureTextEntry
          textContentType="password"
          autoCompleteType="password"
        />
        <AppTextInput
          autoCapitalize="none"
          autoCorrect={false}
          icon="lock"
          value={c_password.toString()}
          setValue={setC_Password}
          placeholder="Confirm Password"
          secureTextEntry
          textContentType="password"
          autoCompleteType="password"
        />

        <SubmitButton
          title="Update"
          onPress={handlePasswordChange}
          loading={loading}
        />
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

function TopTabs() {
  return (
    <TopTabNavigator.Navigator
      initialRouteName="History"
      screenOptions={{
        tabBarActiveTintColor: colors.dark,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          color: colors.white,
        },
        tabBarStyle: { backgroundColor: colors.primary },
      }}
    >
      <TopTabNavigator.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarLabel: "Account",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account"
              color={colors.white}
              size={26}
            />
          ),
        }}
      />
      <TopTabNavigator.Screen
        name="Password"
        component={PasswordScreen}
        options={{
          tabBarLabel: "Password",

          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="lock"
              color={colors.white}
              size={26}
            />
          ),
        }}
      />
    </TopTabNavigator.Navigator>
  );
}

function Profile({ navigation }) {
  return (
    <>
      <Header navigation={navigation} HeaderTitle="Profile" />
      <TopTabs />
    </>
  );
}
export default Profile;

const styles = StyleSheet.create({
  Maincontainer: {
    flex: 1,
    justifyContent: "space-between",
    marginHorizontal: 5,
    backgroundColor: colors.white,
  },
  container: {
    marginTop: 15,
    alignItems: "center",
    padding: 10,
  },
  icon: {
    position: "absolute",
    top: 125,
    right: 110,
    elevation: 3,
  },
  headerLine: {
    margin: 20,
  },
});
