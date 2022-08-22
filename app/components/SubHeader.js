import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import colors from "../config/colors";
import { Button } from "@rneui/themed";

function SubHeader({
  buttonTitle,
  subTitle,
  onPress,
  data,
  proWidth = true,
  backgroundColor = "toolbar",
  buttonColor = "primary",
  loading,
}) {
  return (
    <View
      style={[
        styles.topContainer,
        { backgroundColor: colors[backgroundColor] },
      ]}
    >
      <Button
        onPress={onPress}
        title={
          loading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            buttonTitle
          )
        }
        containerStyle={{
          width: data ? 200 : proWidth ? 340 : 200,
          marginHorizontal: data ? 15 : proWidth ? 15 : 90,
        }}
        buttonStyle={[
          {
            backgroundColor: colors[buttonColor],
            borderRadius: 7,
          },
        ]}
        titleStyle={{
          textTransform: "uppercase",
        }}
      />
      {/* <Text style={styles.text}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : null}
      </Text> */}

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
