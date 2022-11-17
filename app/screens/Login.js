import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  ToastAndroid,
  Platform,
  AlertIOS,
  Image,
  Dimensions,
  Text,
} from "react-native";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppTextInput from "../components/Auth/AppTextInput";
import SubmitButton from "../components/Button/SubmitButton";
import CircleLogo from "../components/Auth/CircleLogo";
// import { AuthContext } from "../context/authContext";
import colors from "../config/colors";
import axios from "axios";
import useSettings from "../hooks/useSettings";
import Header from "../components/Header";
var { width } = Dimensions.get("window");

function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // const [auth, setAuth] = useContext(AuthContext);
  const { name, companyLogo } = useSettings();

  // useEffect(() => {
  //   if (state) {
  //     navigation.navigate("Home");
  //   }
  // }, []);

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
        // setAuth(data);
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
    <View
      // enableOnAndroid={true}
      // contentContainerStyle={{ flexGrow: 1 }}
      // showsVerticalScrollIndicator={false}
      style={styles.container}
    >
      <Header
        // HeaderTitle="Login"
        justifyContent="center"
      />
      <View style={styles.logoContainer}>
        <CircleLogo>
          {companyLogo && companyLogo ? (
            <Image
              source={{ uri: companyLogo }}
              style={{
                height: 200,
                width: 200,
                borderRadius: 100,
                marginVertical: 20,
                borderWidth: 3,
                borderColor: colors.primary,
              }}
            />
          ) : null}
        </CircleLogo>
        {name && name ? (
          <Text
            center
            style={{
              marginTop: 25,
              fontWeight: "bold",
              fontSize: 22,
              textTransform: "uppercase",
            }}
          >
            {name}
          </Text>
        ) : null}
      </View>

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
    </View>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  MainContainer: {
    padding: 20,
    paddingRight: 10,
    paddingLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    height: width * 2,
    marginVertical: (width * 1) / 8,
  },
  logoContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: -15,
    position: "absolute",
    top: 35,
    left: 70,
  },
});
