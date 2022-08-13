import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  ToastAndroid,
  Platform,
  AlertIOS,
  Image,
  Dimensions,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppTextInput from "../components/Auth/AppTextInput";
import SubmitButton from "../components/Button/SubmitButton";
// import CircleLogo from "../components/Auth/CircleLogo";
import { AuthContext } from "../context/authContext";
import colors from "../config/colors";
import axios from "axios";
var { width } = Dimensions.get("window");

function Signin({ navigation }) {
  const [email, setEmail] = useState("sasco@gmail.com");
  const [password, setPassword] = useState("otompo123@");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useContext(AuthContext);
  //   const { name, companyLogo } = useSettings();

  useEffect(() => {
    if (state) {
      navigation.navigate("Dashboard");
    }
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    if (!email || !password) {
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
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.post(`/api/auth/signin`, {
        email,
        password,
      });
      if (data.error) {
        alert(data.error);
        setLoading(false);
      } else {
        setState(data);
        await AsyncStorage.setItem("@auth", JSON.stringify(data));
        setEmail("");
        setPassword("");
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
        navigation.navigate("Dashboard");
      }
    } catch (err) {
      setLoading(false);
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
    }
  };

  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      contentContainerStyle={{ flexGrow: 1 }} // make the scrollView full screen
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      <View style={styles.MainContainer}>
        <AppTextInput
          autoCapitalize="none"
          autoCorrect={false}
          icon="email"
          placeholder="Email..."
          keyboardType="email-address"
          textContentType="emailAddress"
          value={email}
          setValue={setEmail}
        />

        <AppTextInput
          autoCapitalize="none"
          autoCorrect={false}
          icon="lock"
          value={password}
          setValue={setPassword}
          placeholder="Password..."
          secureTextEntry
          textContentType="password"
          autoCompleteType="password"
        />

        <SubmitButton title="Log In" onPress={handleSubmit} loading={loading} />
      </View>
    </KeyboardAwareScrollView>
  );
}

export default Signin;

const styles = StyleSheet.create({
  container: {
    // padding: 10,
    backgroundColor: colors.white,
  },
  MainContainer: {
    width: width * 1,
    padding: 20,
    paddingRight: 10,
    paddingLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    height: width * 2,
  },
  logoContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: -15,
  },
});
