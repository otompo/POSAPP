import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../config/colors";
import { Button } from "@rneui/themed";

function SubHeader({ buttonTitle, subTitle, onPress, data, proWidth = true }) {
  return (
    <View style={styles.topContainer}>
      <Button
        onPress={onPress}
        title={buttonTitle}
        containerStyle={{
          width: data ? 200 : proWidth ? 340 : 200,
          marginHorizontal: data ? 15 : proWidth ? 15 : 90,
        }}
        buttonStyle={{
          backgroundColor: colors.primary,
          borderRadius: 7,
        }}
      />

      <Text style={styles.topText}> {subTitle}</Text>
      {data && (
        <View
          style={{
            height: 30,
            width: 30,
            borderRadius: 15,
            backgroundColor: colors.primary,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: colors.white, fontWeight: "500" }}>{data}</Text>
        </View>
      )}
    </View>
  );
}

export default SubHeader;

const styles = StyleSheet.create({
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
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginRight: 15,
  },
});
