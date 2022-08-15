import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  AlertIOS,
  Text,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AppTextInput from "../components/Auth/AppTextInput";
import CircleLogo from "../components/Auth/CircleLogo";
import SubmitButton from "../components/Button/SubmitButton";
import useSettings from "../hooks/useSettings";
import * as ImagePicker from "expo-image-picker";
import colors from "../config/colors";
import axios from "axios";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import Header from "../components/Header";

function Settings({ navigation }) {
  const richText = React.createRef();
  const [loading, setLoading] = useState(false);
  const [uploadImage, setUploadImage] = useState("");

  const {
    name,
    address,
    email,
    contactNumber,
    website,
    companyLogo,
    description,
    setName,
    setAddress,
    setEmail,
    setContactNumber,
    setWebsite,
    setCompanyLogo,
    setDescription,
  } = useSettings();

  const handleUpdateSubmit = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/admin/settings`, {
        slug: "company",
        name,
        address,
        contactNumber,
        email,
        website,
        description,
        companyLogo,
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
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
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

    if (!pickerResult.cancelled) {
      let base64Image = `data:image/jpg;base64,${pickerResult.base64}`;
      // save image to state for preview
      // setCompanyLogo(base64Image);
    }
  };

  const richTextHandle = (description) => {
    setDescription(description);
  };

  return (
    <>
      <Header navigation={navigation} HeaderTitle="Settings" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <View style={styles.logoContainer}>
          <CircleLogo>
            {companyLogo && companyLogo ? (
              <Image
                source={{ uri: companyLogo }}
                style={{
                  height: 160,
                  width: 160,
                  borderRadius: 100,
                  marginVertical: 20,
                  borderWidth: 3,
                  borderColor: colors.primary,
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
              <TouchableOpacity onPress={() => handleUpload()}>
                <MaterialCommunityIcons
                  name="camera"
                  size={40}
                  color={colors.primary}
                />
              </TouchableOpacity>
            )}
          </CircleLogo>
          {companyLogo && companyLogo ? (
            <TouchableOpacity onPress={() => handleUpload()}>
              <MaterialCommunityIcons
                name="camera"
                size={30}
                color={colors.white}
                style={{
                  marginTop: -45,
                  marginLeft: 80,
                  marginBottom: 5,
                  alignSelf: "center",
                  backgroundColor: colors.primary,
                  borderRadius: 100,
                  padding: 5,
                }}
              />
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View> */}
        <View style={styles.MainContainer}>
          <AppTextInput
            autoCapitalize="words"
            autoCorrect={false}
            icon="pencil"
            placeholder="Enter company name"
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
            value={contactNumber}
            setValue={setContactNumber}
          />
          <AppTextInput
            autoCapitalize="words"
            autoCorrect={false}
            icon="map-marker"
            placeholder="Enter company location"
            value={address}
            setValue={setAddress}
          />
          <AppTextInput
            autoCapitalize="words"
            autoCorrect={false}
            icon="web"
            placeholder="Enter company name"
            value={website}
            setValue={setWebsite}
          />

          <View style={styles.richTextContainer}>
            {description && description ? (
              <>
                <RichEditor
                  ref={richText}
                  onChange={richTextHandle}
                  placeholder="Write your cool content here :)"
                  androidHardwareAccelerationDisabled={true}
                  style={styles.richTextEditorStyle}
                  initialHeight={250}
                  initialContentHTML={description}
                />
                <RichToolbar
                  editor={richText}
                  selectedIconTint="#0288F5"
                  iconTint="#FFFFFF"
                  actions={[
                    actions.removeFormat,
                    actions.setBold,
                    actions.setItalic,
                    actions.insertBulletsList,
                    actions.insertOrderedList,
                    actions.insertLink,
                    actions.setUnderline,
                    actions.undo,
                    actions.redo,
                  ]}
                  iconMap={{
                    [actions.heading1]: ({ tintColor }) => (
                      <Text style={[{ color: tintColor }]}>H1</Text>
                    ),
                  }}
                  style={styles.richTextToolbarStyle}
                />
              </>
            ) : null}
          </View>
          <SubmitButton
            title="Update"
            onPress={handleUpdateSubmit}
            loading={loading}
          />
        </View>
      </ScrollView>
    </>
  );
}

export default Settings;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingRight: 10,
    paddingLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: -15,
  },

  richTextContainer: {
    display: "flex",
    flexDirection: "column-reverse",
    width: "100%",
    marginBottom: 10,
  },

  richTextEditorStyle: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    fontSize: 20,
    overflow: "hidden",
  },

  richTextToolbarStyle: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
  },
});
