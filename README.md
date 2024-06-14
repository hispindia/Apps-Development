# Standard Report App

Custom Report App is a ReactJs app used for generating custom reports.

    ```
    Note: This app is cloned from `standard-report-app` with some upgrade.
    ```

## Prerequisites

-   Firstly update the base url in `.env.development` if your DHIS2 installation is not available at `http://localhost:8080`. For example, if
    your DHIS2 installation is available at `http://localhost:8090`:
    ```
    REACT_APP_DHIS2_BASE_URL=http://localhost:8090
    ```

-   Change the version in `.env` if the DHIS2 version is 30 then write it as:
    ```
    REACT_APP_DHIS2_API_VERSION=30
    ```

    Note: This app is not dependent on the below command; however, it is recommended to run this once.

    ```  
    yarn global add @dhis2/cli

    ```

## Installation

-   Execute the commands:

    ```
    yarn install
    yarn start
    ```

# Building

    ```
    yarn build
    ```
    For Uploading the app, you can use the zip file; path: `./build/custom-report.zip`