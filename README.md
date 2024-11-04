# @pollinginc/polling-react-sdk

## Introduction

This is a React library for interacting with Polling.com services, which was created on top of our vanilla JS library.

This SDK allows you to send events, log purchases, and display embedded survey pages or show a specific survey seamlessly within your React application.

[Read more on our docs](https://docs.polling.com/integration/react-sdk)

## Installation

To install the SDK, run the following command:

```bash
npm install @pollinginc/polling-react-sdk
```

## Usage

### Getting Started
Before starting, you will need to obtain an API key from Polling.com, the API key links your integration to a embed on the Polling.com platform.

You will also need to provide a Customer ID (your customer), which is your unique identifier for the user on your application, we'll use this to link them to their surveys and events inside Polling.com.

### Provider Usage

Wrap your application or the parent component with the `PollingSDKProvider` to initialize the SDK and provide the context methods to your children components.
Required props are `apiKey` and `customerId`.

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { PollingSDKProvider } from '@pollinginc/polling-react-sdk';

const App = () => (
    <PollingSDKProvider apiKey="your-api-key" customerId="your-customer-unique-id">
        <YourComponent />
    </PollingSDKProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
```

### Hook Usage

Use the `usePollingSDK` hook to access the SDK methods within your components.

Available methods are
- `logSession()` - Logs a simple Session event for the given user
- `logPurchase(cents: number)` - Logs a Purchase event for the given user with the amount in cents
- `logEvent(eventName: string, eventValue?: string | number)` - Sends a custom event name and value - **NOTE:** This method is only available for Business+ plans.
- `showEmbedView()` - Opens the Polling.com embed view popup, which will show the user's surveys (list of surveys, random or a fixed survey depending on the user's settings)
- `showSurvey(surveyUiid: string)` - Opens a popup with a specific survey by its UUID
- `setApiKey(apiKey: string)` - Changes the API key on the fly, useful if you want to handle multiple embeds with a single SDK instance
- `setCustomerId(customerId: string)` - Changes the Customer ID on the fly

```tsx
import React from 'react';
import { usePollingSDK } from '@pollinginc/polling-react-sdk';

const YourComponent = () => {
    const { logSession, logPurchase, logEvent, showEmbedView, showSurvey } = usePollingSDK();

    const handleLogSession = () => {
        logSession();
    };

    const handleLogPurchase = () => {
        logPurchase(1000); // Log a purchase of 10 usd (1000 cents)
    };

    const handleLogEvent = async () => {
        await logEvent('My Custom Event', 'My Nice Value');
    };

    const handleShowEmbedView = () => {
        showEmbedView();
    };

    const handleShowSurvey = () => {
        showSurvey('survey-uuid');
    };

    return (
        <div>
            <button onClick={handleLogSession}>Log Session</button>
            <button onClick={handleLogPurchase}>Log Purchase</button>
            <button onClick={handleLogEvent}>Log Event</button>
            <button onClick={handleShowEmbedView}>Show Embed View</button>
            <button onClick={handleShowSurvey}>Show Survey</button>
        </div>
    );
};

export default YourComponent;
```