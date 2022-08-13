import React, { useState, useEffect, createContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SlugContext = createContext([{}, function () {}]);

const SlugProvider = ({ children }) => {
  const [slug, setSlug] = useState({
    slug: null,
  });

  useEffect(() => {
    const loadFromAsyncStorage = async () => {
      let data = await AsyncStorage.getItem("@slug");
      const as = JSON.parse(data);
      //   console.log("as", as);
      setSlug({
        slug: as && as,
        ...as,
      });
    };
    loadFromAsyncStorage();
  }, []);
  return (
    <SlugContext.Provider value={[slug, setSlug]}>
      {children}
    </SlugContext.Provider>
  );
};

export { SlugContext, SlugProvider };
