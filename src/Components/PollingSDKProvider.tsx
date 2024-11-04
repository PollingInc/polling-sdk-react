import React, { createContext, useContext, useEffect, useState } from "react";
import { Polling, SdkPayload } from "@pollinginc/polling-sdk-js";

export interface PollingSDKContextProps {
    pollingSdk: Polling;
    logSession: () => void,
    logPurchase: (cents: number) => any,
    logEvent: (eventName: string, eventValue?: string | number) => Promise<any>,
    showEmbedView: () => any,
    showSurvey: (surveyUuid: string) => void,
    setApiKey: (apiKey: string) => void,
    setCustomerId: (customerId: string) => void,
}

export interface PollingSDKProviderProps extends SdkPayload {
    children: React.ReactNode;
}

const PollingSDKContext = createContext<PollingSDKContextProps | undefined>({} as any);

export function PollingSDKProvider({ children, ...props }: PollingSDKProviderProps) {
    const [pollingSdk, setSdk] = useState<Polling>(
        new Polling
    );

    useEffect(() => {
        setSdk(pollingSdk.initialize(props));
    }, []);

    useEffect(() => {
        setSdk(pollingSdk.setCustomerId(props.customerId));
    }, [props.customerId]);

    useEffect(() => {
        setSdk(pollingSdk.setApiKey(props.apiKey));
    }, [props.apiKey]);

    return (
        <PollingSDKContext.Provider value={{
            pollingSdk,
            logSession: () => pollingSdk.logSession(),
            logPurchase: (cents) => pollingSdk.logPurchase(cents),
            logEvent: async (eventName, eventValue) => pollingSdk.logEvent(eventName, eventValue),
            showEmbedView: () => pollingSdk.showEmbedView(),
            showSurvey: (surveyUuid: string) => pollingSdk.showSurvey(surveyUuid),
            setApiKey: (apiKey: string) => pollingSdk.setApiKey(apiKey),
            setCustomerId: (customerId: string) => pollingSdk.setCustomerId(customerId),
        }}>
            {children}
        </PollingSDKContext.Provider>
    );
}

export const usePollingSDK = (): PollingSDKContextProps => {
    const context = useContext(PollingSDKContext);

    if (context === undefined) {
        throw new Error("usePollingSDK must be used within a PollingSDKProvider");
    }

    return context;
};
