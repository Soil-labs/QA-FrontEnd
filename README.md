# Eden Automation Tests

## Introduction

Eden automation tests are written using **[Playwright](https://playwright.dev/)** framework that ensures the quality of the applicaiton on functional levels. Additionally it also ensures end to end functionality simulating user flows.


## How to Execute the Tests

  1. Clone the repo

  ```bash
  git clone https://github.com/Soil-labs/QA-FrontEnd.git
  ```

  2. Install the dependencies
  
  ```bash
  npm install
  ```
  **Note:** If you face any issue regarding module staff please run `npm install playwright-core` and try again.

  3. Set environment variables in `.env` file (refer to the `.env.example`)
  
  ```
  APP_URL=your_app_url
  GRAPHQL_ENDPOINT=your_graphql_endpoint
  ....................
  ```

  4. Run the tests
  
  ```bash
  # Functional Tests
  npm run test:functinality

  # End to End Tests
  npm run test:end2end
  ```