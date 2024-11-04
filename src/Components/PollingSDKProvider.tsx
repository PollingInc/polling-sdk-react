import React, { createContext, useContext, useEffect, useState } from "react";
import { Polling, SdkPayload } from "@pollinginc/polling-sdk-js";

export interface PollingSDKContextProps {
    pollingSdk: Polling | null;
    logSession: () => void,
    logPurchase: (cents: number) => void,
    logEvent: (eventName: string, eventValue?: string | number) => Promise<void>,
    showEmbedView: () => void,
    showSurvey: (surveyUuid: string) => void,
}

export interface PollingSDKProviderProps extends SdkPayload {
    children: React.ReactNode;
}

const PollingSDKContext = createContext<PollingSDKContextProps | undefined>({
    pollingSdk: null,
    logSession: () => { },
    logPurchase: (cents) => { },
    logEvent: async (eventName, eventValue) => { },
    showEmbedView: () => { },
    showSurvey: (surveyUuid) => { },
});

export function PollingSDKProvider({ children, ...props }: PollingSDKProviderProps) {
    const [pollingSdk] = useState<Polling>(
        new Polling
    );

    useEffect(() => {
        const initializeSDK = async () => {
            await pollingSdk.initialize(props);
        };

        initializeSDK();
    }, []);

    useEffect(() => {
        if (pollingSdk) {
            pollingSdk.setCustomerId(props.customerId);
        }
    }, [props.customerId]);

    useEffect(() => {
        if (pollingSdk) {
            pollingSdk.setApiKey(props.apiKey);
        }
    }, [props.apiKey]);

    return (
        <PollingSDKContext.Provider value={{
            pollingSdk,
            logSession: pollingSdk.logSession,
            logPurchase: pollingSdk.logPurchase,
            logEvent: pollingSdk.logEvent,
            showEmbedView: pollingSdk.showEmbedView,
            showSurvey: pollingSdk.showSurvey,
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
