import { useReducer, createContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import reducers from "../actions/Reducers";

// create context
const PurchaseContext = createContext([{}, function () {}]);

// context provider
const PurcahseProvider = ({ children }) => {
  // initial state
  const initialState = {
    cart: [],
  };
  const [stateData, dispatch] = useReducer(reducers, initialState);
  const { cart } = stateData;

  useEffect(() => {
    const loadDataAsyncStorage = async () => {
      const __next__cart01__devat = await AsyncStorage.getItem(
        "__next__cart01__devat"
      );
      const asData = JSON.parse(__next__cart01__devat);
      if (asData) dispatch({ type: "ADD_CART", payload: asData });
    };
    loadDataAsyncStorage();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("__next__cart01__devat", JSON.stringify(cart));
  }, [cart]);

  return (
    <PurchaseContext.Provider value={{ stateData, dispatch }}>
      {children}
    </PurchaseContext.Provider>
  );
};

export { PurchaseContext, PurcahseProvider };
