
# Tastify

A music analysis tool to compare your music taste with your friends.


## Getting Started

### Dependencies

- Node.js v.18.13.0+ (Has not been tested with any other version yet)

### Installing

1. Clone this repo, or download it
2. Open a terminal and navigate to the project root directory
3. Run the command `npm install`

### Executing program

1. Duplicate the file called `sample.env` and rename one of them to `.env` 
2. Fill in the values for the environment variables
3. Open a terminal and navigate to the project root directory


Now you have two options, developer mode or production mode.

To run the API in developer mode:
- Run the command `npm run compiler` to open a TypeScript compiler in "watch mode" to continuously compile changes in the source code on every save.
- Run the command `npm run devStart` to start a server with Nodemon on your local machine which refreshes on every change in the compiled. It will be hosted on the port specified by the `PORT` environment variable. If no `PORT` environment variable is provided, it defaults to port 4000.

To run the API in production mode:
- Run the command `npm run compile` to compile the TypeScript source code into executable JavaScript code.
- Run the command `npm run start` to start a server on your local machine using Node.js

### Run the Test Suite
There are many automated tests, both unit tests and integration tests. To run the entire test suite, run the command `npm run test`. 

There are some requirements for the integration tests to work. A `test.env` file must be added to the `/tests/` folder. To do this:
1. Duplicate the file `/tests/sample.test.env`
2. Rename the duplicated file to `test.env`, keeping it in the `/tests/` folder
3. Fill in the required environment variable values. More on which variable are required below

For the database tests and the database driver tests, these will both require a valid MongoDB database is running. Provide the connection URL and test database name in the environments variables.

For the API endpoint tests, a valid access token from Spotify is required. The recommended way to get one is to manually get one using your browser while the API is running in development mode:
1. With the API running on your local machine, paste the URL`http://localhost:<PORT>/auth/login` and make sure to replace `<PORT>` with the port the API server is running on
2. Copy the link that is provided in the browser from visiting that URL and paste it into your browser search bar
3. Login in with your Spotify credentials and accept their terms
4. Copy the access token that is provided in your browser
5. Paste the access token in your `/tests/test.env` file after `SPOTIFY_API_ACCESS_TOKEN=Bearer`. Make sure that the "Bearer" text is still there and that there is a space between "Bearer" and the access code you just pasted

There are also test runner groups available, which are used to specify a certain type of tests to run. Here is a list of the current groups:
- database
- model
- integration
- unit
- service


## Acknowledgments

Readme Template
* [Simple README](https://gist.github.com/DomPizzie/7a5ff55ffa9081f2de27c315f5018afc)