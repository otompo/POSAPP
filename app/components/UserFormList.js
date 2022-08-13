import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  Text,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Divider } from "react-native-elements";
import colors from "../config/colors";
import AppText from "./AppText";

function UserFormList({
  userName,
  userEmail,
  userContact,
  userCreatedAt,
  userGeneratedPass,
  renderRightActions,
  icon = "chevron-right",
  onPress,
}) {
  return (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={renderRightActions}>
        <TouchableHighlight underlayColor={colors.medium} onPress={onPress}>
          <View style={styles.container}>
            <View style={styles.detailsContainer}>
              <AppText style={styles.title} numberOfLines={1}>
                Name: {userName}
              </AppText>
              {userContact && (
                <AppText style={styles.subTitle} numberOfLines={2}>
                  <Text style={{ color: colors.primary }}>Contact:</Text>{" "}
                  {userContact}
                </AppText>
              )}
              {userEmail && (
                <AppText style={styles.subSubTitle} numberOfLines={2}>
                  <Text style={{ color: colors.primary }}>Email:</Text>{" "}
                  {userEmail}
                </AppText>
              )}
              {!!userGeneratedPass && (
                <AppText style={styles.subSubTitle} numberOfLines={2}>
                  <Text style={{ color: colors.primary }}>
                    Generated Password:
                  </Text>{" "}
                  {userGeneratedPass}
                </AppText>
              )}
              {userCreatedAt && (
                <AppText style={styles.subSubTitle} numberOfLines={2}>
                  <Text style={{ color: colors.primary }}>Joined Date:</Text>{" "}
                  {userCreatedAt}
                </AppText>
              )}
            </View>
            <MaterialCommunityIcons
              name={icon}
              size={25}
              color={colors.medium}
            />
          </View>
        </TouchableHighlight>
        <Divider width={2} />
      </Swipeable>
    </GestureHandlerRootView>
  );
}

export default UserFormList;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: colors.white,
    alignItems: "center",
    // marginBottom: 5,
    marginTop: 5,
  },

  title: {
    fontWeight: "bold",
    fontSize: 20,
    color: colors.primary,
  },
  subTitle: {
    color: colors.dark,
    fontSize: 12,
  },
  subSubTitle: {
    color: colors.dark,
    fontSize: 12,
  },
  detailsContainer: {
    marginLeft: 10,
    justifyContent: "center",
    flex: 1,
  },
});
