import React from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import colors from "../../config/colors";
import { Button } from "@rneui/themed";

function SubmitButton({
  title,
  loading,
  onPress,
  disabled,
  bwidth = "100%",
  bcolor = "primary",
}) {
  return (
    <Button
      buttonStyle={{
        backgroundColor: colors.primary,
        borderRadius: 7,
        padding: 15,
      }}
      containerStyle={{
        width: "100%",
      }}
      disabled={disabled}
      activeOpacity={disabled ? 0.5 : 1}
      style={[
        styles.button,
        { backgroundColor: colors[bcolor], width: bwidth },
      ]}
      onPress={onPress}
    >
      <Text style={styles.text}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          title
        )}
      </Text>
    </Button>
  );
}

export default SubmitButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "100%",
    marginVertical: 10,
  },
  text: {
    color: colors.white,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});
