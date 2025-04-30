import { createContext, useContext, useState } from "react";
const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);

  return (
    <SubscriptionContext.Provider
      value={{ isSubscriptionActive, setIsSubscriptionActive, subscriptionDetails, setSubscriptionDetails }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptionContext = () => useContext(SubscriptionContext);