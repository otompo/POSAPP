import React, { useState, useContext, useEffect } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/authContext";
import { Divider } from "react-native-elements";
import moment from "moment";
import colors from "../config/colors";

export default function DrawerItems(props) {
  const [auth, setAuth] = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [contactNum, setContactNum] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [image, setImage] = useState({
    url: "",
    public_id: "",
  });

  useEffect(() => {
    if (auth.user) {
      const { name, email, image, contactNum, role, createdAt } = auth.user;
      setName(name);
      setEmail(email);
      setRole(role);
      setImage(image);
      setCreatedAt(createdAt);
      setContactNum(contactNum);
    }
  }, [auth]);

  const handleSignout = async () => {
    setAuth({ token: "", user: null });
    await AsyncStorage.removeItem("@auth");
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          margin: 0,
          backgroundColor: colors.primary,
          padding: 10,
        }}
      >
        <View
          style={{
            width: 70,
            height: 70,
            borderRadius: 120,
            marginLeft: 10,
            borderWidth: 2,
            borderColor: colors.white,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name="account"
            size={38}
            color={colors.white}
          />
          {/* <Image
            source={{
              uri: "https://cdn.pixabay.com/photo/2022/08/04/00/51/woman-7363571_960_720.jpg",
            }}
            style={{
              width: 70,
              height: 70,
              borderRadius: 120,
              borderWidth: 2,
              borderColor: colors.white,
            }}
          /> */}
        </View>

        <View>
          <Text style={{ color: colors.white, fontSize: 14, paddingLeft: 10 }}>
            <Text style={{ color: colors.white, fontWeight: "300" }}>
              Name:
            </Text>
            {name}
          </Text>

          <Text style={{ color: colors.white, fontSize: 14, paddingLeft: 10 }}>
            <Text style={{ color: colors.white, fontWeight: "300" }}>
              Contact:
            </Text>
            {contactNum}
          </Text>

          <Text style={{ color: colors.white, fontSize: 14, paddingLeft: 10 }}>
            <Text style={{ color: colors.white, fontWeight: "300" }}>
              Email:
            </Text>
            {email}
          </Text>
          {/* <Text style={{ color: colors.white, fontSize: 14, paddingLeft: 10 }}>
            <Text style={{ color: colors.white, fontWeight: "300" }}>
              JoinDate:
            </Text>
            {moment(`${createdAt}`).format("LL")}
          </Text> */}
        </View>
      </View>
      <DrawerContentScrollView {...props}>
        <View
          style={{
            paddingTop: 5,
          }}
        >
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      <Divider />
      <View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 20,
            marginBottom: 20,
          }}
          onPress={handleSignout}
        >
          <Icon name="power" size={30} color={colors.danger} />
          <Text style={{ color: "#333", fontSize: 16, paddingLeft: 10 }}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
