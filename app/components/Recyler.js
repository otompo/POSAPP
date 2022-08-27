import React, { useEffect, useState } from "react";
import { Dimensions, RefreshControl, Text, View } from "react-native";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview";

function GridList({ data, onEndReached, refetch, networkStatus, loading }) {
  const { width } = Dimensions.get("window");
  const ITEM_HEIGHT = width / 3;

  const [dataProvider, setDataProvider] = useState(
    new DataProvider((r1, r2) => {
      return r1 !== r2;
    })
  );

  const [layoutProvider] = useState(
    new LayoutProvider(
      (index) => 1,
      (type, dim) => {
        dim.width = ITEM_HEIGHT;
        dim.height = ITEM_HEIGHT;
      }
    )
  );

  useEffect(() => {
    setDataProvider((prevState) => prevState.cloneWithRows(data));
  }, [data]);

  const renderFooter = () => {
    return loading ? (
      <ActivityIndicator style={{ margin: 10 }} size="large" color={"black"} />
    ) : (
      <View style={{ height: 60 }} />
    );
  };

  //   const rowRenderer = (type, index) => {
  //     return (
  //       <PhotoItem id={data.id} age={data.age} size={ITEM_HEIGHT} index={index} />
  //     );
  //   };

  if (!data?.length) return null;

  return (
    <>
      <RecyclerListView
        style={{ flex: 1 }}
        dataProvider={dataProvider}
        layoutProvider={layoutProvider}
        rowRenderer={rowRenderer}
        onEndReached={onEndReached}
        // onEndReachedThreshold={25}
        // renderFooter={renderFooter}
        // renderAheadOffset={0}
        scrollViewProps={{
          refreshControl: (
            <RefreshControl
              refreshing={networkStatus === 4}
              onRefresh={() => refetch()}
            />
          ),
        }}
      />
    </>
  );
}

export default GridList;
