import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import colors from "../config/colors";
var { width } = Dimensions.get("window");

function Header({
  navigation,
  HeaderTitle = "Header",
  justifyContent = "space-between",
  cartData,
  onPress,
}) {
  return (
    <SafeAreaView style={styles.headerMain}>
      <View style={[styles.headerInner, { justifyContent: justifyContent }]}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          {navigation && <Icon name="menu-outline" size={28} color="#fff" />}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{HeaderTitle}</Text>
      </View>
      {cartData && (
        <TouchableOpacity style={styles.cartDataStyle} onPress={onPress}>
          <Text style={{ color: colors.white, fontWeight: "500" }}>
            {cartData}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

export default Header;

const styles = StyleSheet.create({
  headerMain: {
    width: width,
    height: width / 4 - 35,
    backgroundColor: colors.primary,
    elevation: 8,
    paddingHorizontal: 10,
    paddingVertical: 15,
    position: "relative",
  },
  headerInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    textAlign: "center",
  },
  headerTitle: { color: "#fff", textTransform: "uppercase" },
  cartDataStyle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 30,
  },
});
