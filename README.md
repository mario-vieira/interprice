# InterPrice

## Description

This is a Vue.js app to show financial data. This data consists of a list of companies with quotes for 3 different metrics: Spread, Yield and 3MLSpread. 

It's possible to filter the data by currency, years and metric.
It's also possible to sort the data by Company or DateSent.

The data is coming from a JSON file, however in a real world application we would have some kind of API endpoint that we would use to get this data. 

## Installation

There are 2 methods to try out the application:

### 1. **Using Docker**

For this method you need to have Docker installed on your machine. The first step is to build the Docker image:

`docker build -t interprice-image .`

Then, we need to run the Vue.js app in a Docker container:

`docker run -it -p 8080:80 --rm -d --name interprice-app interprice-image`

Finally, you should be able to access the application on `localhost:8080`


### 2. **Using NPM**

For this method you need to have NPM installed.

First you need to run ``npm install`` to install all necessary packages and dependencies.

Then, run ``npm run serve`` and you should be able to access the application on `localhost:8080`

## Testing

A few unit tests were written for this Vue.js application using Jest. A lot more scenarios can be added but the basics for each component were tested.

To execute the tests suite run `npm run test:unit`. You will see that a coverage folder was created with the report in HTML and plain text.