import React, { createContext, useContext } from "react";
import { useTenant } from "../hooks/use.tenant";

type TenantContextType = ReturnType<typeof useTenant>;

const TenantContext = createContext<TenantContextType | null>(null);

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
    const tenant = useTenant();
    return (
        <TenantContext.Provider value={tenant}>
        {children}
        </TenantContext.Provider>
    );
};

export const useTenantContext = () => {
    const ctx = useContext(TenantContext);
    if (!ctx) {
        throw new Error("useTenantContext must be used inside a TenantProvider");
    }
    return ctx;
};
