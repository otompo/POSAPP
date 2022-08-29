import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  Text,
  View,
  SafeAreaView,
} from "react-native";
import Header from "../components/Header";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview";
import axios from "axios";
import FormatCurrency from "../helpers/FormatCurrency";
import ListActions from "../components/ListActions";
import ListItems from "../components/ListItems";
const { width } = Dimensions.get("window");

function ManageStatistics({ navigation }) {
  const [data, setData] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [dataProvider, setDataProvider] = useState(
    new DataProvider((r1, r2) => {
      return r1 !== r2;
    })
  );

  const [layoutProvider] = useState(
    new LayoutProvider(
      (index) => {
        return index;
      },
      (type, dim) => {
        dim.width = Dimensions.get("window").width;
        dim.height = (width * 1) / 3.5;
      }
    )
  );

  useEffect(() => {
    setDataProvider((prevState) => prevState.cloneWithRows(data));
  }, [data]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/products`);
      setData(data.products);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const rowRenderer = (type, item, index) => {
    return (
      <ListItems
        key={item._id}
        chevronActive={true}
        iconActive={false}
        mainTitleText="Name:"
        subTitleText="Quantity:"
        subSubSubTitleText="Selling Price:"
        mainTitle={item.name}
        subTitle={`${item.quantity}`}
        subSubSubTitle={FormatCurrency(Number(item.sellingPrice))}
        rightContent={(reset) => (
          <ListActions
            bcolor="online"
            icon="cart"
            onPress={() => {
              dispatch(addToPurchase(item, cart)), reset();
            }}
          />
        )}
      />
    );
  };
  if (!data?.length) return null;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadProducts();
      setRefreshing(false);
    }, 2000);
  };

  const renderFooter = () => {
    return loading ? (
      <ActivityIndicator style={{ margin: 10 }} size="large" color={"black"} />
    ) : (
      <View style={{ height: 60 }} />
    );
  };
  // const onEndReached = async () => {
  //   await setData(20);
  // };

  return (
    <>
      <Header navigation={navigation} HeaderTitle="Manage Statistics" />
      <SafeAreaView style={{ flex: 1 }}>
        <RecyclerListView
          style={{ flex: 1 }}
          dataProvider={dataProvider}
          layoutProvider={layoutProvider}
          rowRenderer={rowRenderer}
          onEndReachedThreshold={0.5}
          scrollViewProps={{
            refreshControl: (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            ),
          }}
        />
      </SafeAreaView>
    </>
  );
}

export default ManageStatistics;

const styles = StyleSheet.create({
  // container: {
  //   justifyContent: "center",
  //   flex: 1,
  // },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: "#800000",
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
});
