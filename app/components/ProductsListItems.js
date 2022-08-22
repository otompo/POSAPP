import React from "react";
import {
  View,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  RefreshControl,
} from "react-native";
import ListActions from "./ListActions";
import colors from "../config/colors";
import ListItems from "./ListItems";
import FormatCurrency from "../helpers/FormatCurrency";
import moment from "moment";

function ProductsListItems({
  keyword,
  products,
  refreshing,
  onRefresh,
  handleMakeProductActive,
  handleMakeProductInactive,
  searched,
  icon,
  iconActive = false,
  leftContent,
}) {
  return (
    <>
      {keyword ? (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            // style={{ backgroundColor: colors.danger }}
          >
            {products.length > 0 ? (
              products.filter(searched(keyword)).map((product, index) => (
                <ListItems
                  chevronActive={true}
                  iconActive={iconActive}
                  mainTitleText="Name:"
                  titleText="Category:"
                  subTitleText="Quantity:"
                  subSubTitleText="Cost Price:"
                  subSubSubTitleText="Selling Price:"
                  subSubSubSubTitleText="Expired Date:"
                  mainTitle={product.name}
                  subTitle={`${product.quantity}`}
                  subSubTitle={FormatCurrency(Number(product.costPrice))}
                  subSubSubTitle={FormatCurrency(Number(product.sellingPrice))}
                  title={
                    product &&
                    product.category &&
                    product.category.map((c, i) => `${c && c.name}`)
                  }
                  subSubSubSubTitle={`${moment(
                    product && product.expireDate
                  ).format("LL")} `}
                  rightContent={(reset) => (
                    <>
                      {product && product.active ? (
                        <>
                          <ListActions
                            bcolor="online"
                            icon={"check-circle"}
                            onPress={(e) => (
                              handleMakeProductActive(e, product.slug), reset()
                            )}
                          />
                        </>
                      ) : (
                        <>
                          <ListActions
                            icon={"close-circle-outline"}
                            onPress={(e) => (
                              handleMakeProductInactive(e, product.slug),
                              reset()
                            )}
                          />
                        </>
                      )}
                    </>
                  )}
                  leftContent={leftContent}
                />
              ))
            ) : (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: colors.dark, fontSize: 20 }}>
                  No Result found
                </Text>
              </View>
            )}
          </ScrollView>
        </>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(product) => product.slug.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item, index }) => (
            <View
              style={{
                backgroundColor: "white",
                elevation: 2,
                marginBottom: 5,
                marginVertical: 10,
              }}
            >
              <ListItems
                key={index}
                chevronActive={true}
                iconActive={iconActive}
                icon={icon}
                mainTitleText="Name:"
                titleText="Category:"
                subTitleText="Quantity:"
                subSubTitleText="Cost Price:"
                subSubSubTitleText="Selling Price:"
                subSubSubSubTitleText="Expired Date:"
                mainTitle={item.name}
                subTitle={`${item.quantity}`}
                subSubTitle={FormatCurrency(Number(item.costPrice))}
                subSubSubTitle={FormatCurrency(Number(item.sellingPrice))}
                title={
                  item &&
                  item.category &&
                  item.category.map((c, i) => `${c && c.name}`)
                }
                subSubSubSubTitle={`${moment(item && item.expireDate).format(
                  "LL"
                )} `}
                rightContent={(reset) => (
                  <>
                    {item && item.active ? (
                      <>
                        <ListActions
                          bcolor="online"
                          icon={"check-circle"}
                          onPress={(e) => (
                            handleMakeProductActive(e, item.slug), reset()
                          )}
                        />
                      </>
                    ) : (
                      <>
                        <ListActions
                          icon={"close-circle-outline"}
                          onPress={(e) => (
                            handleMakeProductInactive(e, item.slug), reset()
                          )}
                        />
                      </>
                    )}
                  </>
                )}
                leftContent={
                  <View>
                    <Text>{leftContent}</Text>
                  </View>
                }
              />
            </View>
          )}
        />
      )}
    </>
  );
}

export default ProductsListItems;

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
    fontWeight: "bold",
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
