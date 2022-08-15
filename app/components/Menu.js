import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../config/colors";

function Menu({ title, onPress, subTitle }) {
  return (
    <View style={styles.flatList}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
          <Text style={styles.titleText}>{title}</Text>

          <View style={styles.subCard}>
            <Text style={styles.cardText}>{subTitle}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default Menu;

const styles = StyleSheet.create({
  container: {
    height: 45,
    marginTop: 10,
    marginBottom: 15,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: colors.airblue,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  flatList: {
    height: 60,
    flexGrow: 0,
    marginBottom: 60,
  },
  titleText: {
    color: colors.white,
    paddingLeft: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  subCard: {
    height: 45,
    width: 45,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.white,
    marginLeft: 5,
  },
  cardText: {
    fontSize: 14,
    textTransform: "uppercase",
    color: colors.white,
  },
});
