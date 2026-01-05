# React Native Auto Play Example

This example app showcases the features of the `react-native-autoplay` library.
<div>
    <img alt="image" src="https://github.com/user-attachments/assets/10565e63-8918-44f9-aad4-1e9c256cd713" style="width: 45%" />
    <img alt="image" src="https://github.com/user-attachments/assets/de4720f5-87a1-470c-960d-aa04c7446765" style="width: 45%" />
</div>

## Getting Started

1.  **Install dependencies:**

    ```bash
    yarn install
    ```

2.  **Run the app:**

    *   **iOS:**

        ```bash
        yarn ios
        ```

        You can test CarPlay with the iOS Simulator or with the CarPlay Simulator app, which is available as part of the "Additional Tools for Xcode". 

    *   **Android:**

        To run the app on Android Auto, you need to set up the Desktop Head Unit (DHU). For more information, see the [Android Developer documentation](https://developer.android.com/training/cars/testing/dhu).

        You also need to forward a port to the DHU. You can use the `adb_port_setup.sh` script located in the root of this project.

        ```bash
        ../../adb_port_setup.sh
        ```

        Then, you can run the app:

        ```bash
        yarn android
        ```

## Features

This example app demonstrates how to:

*   **Use various templates**, including:
    *   `GridTemplate`
    *   `ListTemplate`
    *   `SearchTemplate`
    *   `InformationTemplate`
    *   `MessageTemplate`
    *   `NowPlayingTemplate`
*   **Display content on the instrument cluster** using `AutoPlayCluster`.
*   **Display content on the CarPlay dashboard** using `CarPlayDashboard`.
*   **Access telemetry data** on Android Auto.
*   **Use voice input** on Android Auto.
