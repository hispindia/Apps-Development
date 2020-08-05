# Standard Report App

Standard Report App is a ReactJs app used for generating custom reports.


## Prerequisites

This app is not dependent on the below command still we recommend running this once.

```  
yarn global add @dhis2/cli

```

## Installation

-   Firstly update the base url in `.env.development` if your DHIS2 installation is not available at `http://localhost:8080`. For example, if your DHIS2 installation is available at `http://localhost:8090`:
    ```
    REACT_APP_DHIS2_BASE_URL=http://localhost:8090
    ```

-   Change the version in `.env` if the DHIS2 version is 30 then write it as:
    ```
    REACT_APP_DHIS2_API_VERSION=30
    ```

-    Execute the commands:

    ```
    yarn install
    yarn start
    ```

# Building

```
    yarn build
```