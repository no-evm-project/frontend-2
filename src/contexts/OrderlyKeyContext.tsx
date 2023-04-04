import { KeyPair, keyStores } from "near-api-js";
import React, { ReactNode, useMemo, useState } from "react";

interface OrderlyKeyContextValue {
    key: string;
}
const OrderlyKeyContext = React.createContext<OrderlyKeyContextValue>({} as OrderlyKeyContextValue);

export const OrderlyKeyContextProvider: React.FC<{
    children: ReactNode;
  }> = ({ children }) => {
    const [key, setKey] = useState<string>('');

    
    
      

    return <OrderlyKeyContext.Provider value={{key}}>{children}</OrderlyKeyContext.Provider>;
};