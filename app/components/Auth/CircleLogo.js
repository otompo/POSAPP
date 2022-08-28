import React from "react";
import { View, Image } from "react-native";
import colors from "../../config/colors";

function CircleLogo({ children }) {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        // paddingTop: 10,
        // paddingBottom: 20,
      }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          height: 200,
          width: 200,
          borderRadius: 100,
          borderWidth: 2,
          borderColor: colors.primary,
          backgroundColor: colors.white,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 17,
          marginTop: 15,
        }}
      >
        {children ? (
          children
        ) : (
          <Image
            source={require("../../assets/logo.png")}
            style={{
              width: 200,
              height: 200,
              borderWidth: 2,
              borderColor: colors.primary,
              marginVertical: 30,
              marginHorizontal: 30,
              borderRadius: 100,
            }}
          />
        )}
      </View>
    </View>
  );
}

export default CircleLogo;
