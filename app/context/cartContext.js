import { useReducer, createContext, useEffect } from "react";
import reducers from "../actions/Reducers";
import AsyncStorage from "@react-native-async-storage/async-storage";

// create context
const CartContext = createContext([{}, function () {}]);

// context provider
const CartProvider = ({ children }) => {
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
    <CartContext.Provider value={{ stateData, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
