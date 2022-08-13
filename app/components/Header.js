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

function Header({ navigation, HeaderTitle = "Header" }) {
  return (
    <SafeAreaView style={styles.headerMain}>
      <View style={styles.headerInner}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{HeaderTitle}</Text>
      </View>
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
  },
  headerInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    textAlign: "center",
  },
  headerTitle: { color: "#fff", textTransform: "uppercase" },
});
