# Alchemy React Test

## This implementation
I got a feeling that the engineering team at Alchemy _really likes_ pingpong! In
light of this, I created a pingpong game management platform to manage the office
teams (thanks to a great backend API!). Features of this platform include:

### Pages
- Home page | Roster _on "/" if not logged in, "/roster" if logged in._ Redirected here automatically on login/register.
- Splash  _on root "/splash" url_
- Login  _on "/login"_
- Register _on "/register"_
- 404 error on invalid url entry

Once logged in or registered, you are transported to your roster (_on "/roster") where you can:

- Add a player _on /player/new and "+" at the top of the page_
- Remove a player (with confirmation dialog) _on "X" roster column on roster table_

A nice feature update might be to allow inline text field editing.

### Implementation

#### Config
A configuration file is include to allow a single point of API definition specifications for Urls, fieldnames and test player definitions. They employ static getters so that the consuming files can access the required data via a "config.Resource" name.

#### Styling
I utilized (and played with!) Material UI (MUI) for the platform interface. It does add a lot of markup to the final HTML! The styling is in the .js component file and incorporated utilizing a __withStyles__ HOC. It is easy to manipulate these styles, or you can invest in defining your own theme utilizing Material UI's theme builder.

Material UI utilizes the Roboto Google font which is included in the index.html file with via CDN call.

In addition to Material UI, a few layouts utilize external <Component_name>.css files.

#### Authorization
An __AuthHelperMethods.js__ file is included as in object in the routes.js file which is passed to all the project components. Reworking this, the components that require a loggedIn state (via login/register) could be wrap with a HOC and to eliminate passing the auth property in the route definition file.

The __apiCamelizedLookup__ object provides a fieldname check and crossreference for the form field names. It aids in translation of valid property names to whatever the API required (single point of definition between the state properties and api names). It was assumed if the ESLint rules did not allow underscores (as specified in the API names), then, rather than overriding the linter, a mechanism should be incorporated to allow any API to specify properties as required and they can then be updated in one location. If form fields are checked for testing, then the form component can also utilize the apiCamelizedLookup for field specifications.

#### Testing
I used Jest, Enzyme and Sinon to unit test the main modules. Any fetch operations were stubbed/mocked and the JWT authorization is checked via a Mock of the AuthHelperMethods loggedIn. This auth module writes the token to local storage and returns the user "loggedIn" status to componentWillMount queries from protected pages.

The Material UI component "wraps" a new dimension to the unit testing. Each styled component is wrapped with a MUI "withStyles" HOC which applies the 'css in js' styles to the component. This required a little work with enzyme's shallow components to reach some of the component children while testing. The render pattern was:

```
const wrap = shallow(<Component auth={auth} history={history} />);
const unwrappedWrap = wrap.first().shallow();
```

This enabled method and access to the Components children.

The AuthHelperMethods.js (auth) methods were stubbed to eliminate calling the API directly for these initial tests. Jest, Enzyme and Sinon were use for these. Enzyme and Sinon were used for stubs and spys when not bypassing the actual Component methods. Values in the auth module were mocked to signal loggedIn states (mostly checked in componentWillMount) and history.replace URL reassignments for navigation.


#### Wrap up
The __lint:js__ and __lint:style__ tests run without errors.

The e2e tests did not pass - I am still investigating if the cause is the implementation of the authorization in __AuthHelperMethods.js__.  Because these methods perform the actual fetching and storing of the JWT token, return any data from the api,  perform the "loggedIn" test for the subscribing components, the stubbed token in the end to end tests are not loading the token in the local storage and the redirection on successful register/login is not enabled.

I enjoyed (and still am) this challenge! It shows authorization schemes, API interfacing and the endless ways of implementing and testing UIs with current ES6 technologies. I used VSCode as my IDE which incorporated esLinting as I coded which helped with the implementation of javascript and formatting. I learned about the pros/cons of Material UI as far as testing goes, and dabbled with Sinon which I hadn't used before.

TODO: e2e tests.  I have run all the user stories manually and they are successful and fulfill the user stories outlined.


## Background
The engineering team at Alchemy has built an (imaginary) game management platform.
The platform has an API that allows you to create a manager(user) that allows them 
to manage player rosters for their chosen sport.

## Your Mission
Build a user interface you'll want to brag about.
The game you choose is up to you. Office Ping-Pong, soccer, football, quidditch, or professional netflix binging.
Read all of the instructions for great success.

## Pre-Requirements
- Have Node v8+ installed on your system
- An editor/IDE that brings you joy

## Required User Stories
- As a user when I navigate to '/' then I should see a home page with login and registration links.
- As a user when I navigate to '/register' then I should a registration page with fields for (first_name, last_name, email, password, confirm_password)
- As a user I want to see my player roster after I create my account
- As a user when I navigate to '/roster' then I should see the roster
- As a user when I navigate to '/login' I should see a page where I can enter my email and password
- As a user when I complete login I should see my player roster
- As a user when I navigate to '/player/new' I should see a page to add a player to my roster.
- As a user I expect that I'll see my roster with the new player after I add them.

## Optional User Stories
- As a user I want to be able to log out of my account
- As a user I want to have clear concise error messages when I can't login, add a player, or delete a player

## Setup
- git clone this repository to your favorite directory
- npm install
- npm start

## Success
This test uses cypress to test user interactions, it requires that certain text, css elements, or urls be present.
To see what tests are passing and why run: (Make sure your dev server is already running with npm start)
- npm run e2e

Part of working on a high performing team is making sure that everyone is using consistent style guidelines. This test 
uses ESLint and StyleLint to enforce rules outlined in .eslintrc and .stylelintrc. To check your styles against these guidelines run:
- npm run lint:js
- npm run lint:style

A passing assessment is when all cypress tests are passing and the lint commands return no errors. Reach out to the team if you need help to get there.

After all tests pass, run the app in dev directly against the API url and QA the user experience.

## Bonus
Other factors that we take into account in the assessment.
- Experience in the stack. (Things don't have to be perfect, if this is your first react experience. We understand)
- UX/UI (Color schemes, an eye for layout and design, animations and transitions. Build this project as if someone would use it.)
- Tests (The project has high level end-to-end tests but unit and component level tests are up to you. Automated tests are extremely important.)
- Honest feedback on this assessment.

## API details
The API is currently available here. https://players-api.developer.alchemy.codes/
Your API requests should target this url, but the cypress framework will stub out all responses and still work
even if you don't have an internet connection.

### User API

Part of the `players-api` is managing admin users who are then able to manage players.
A user can only interact with players they have created themselves.

A user consists of the following information:

```json
{
  "id": "<string>",
  "first_name": "<string>",
  "last_name": "<string>",
  "email": "<string>"
}
```

### Create User

Create a new admin user. Each use must have a unique email address.

**POST** /api/user

**Arguments**

| Field            | Type   | Description                |
| ---------------- | ------ | -------------------------- |
| first_name       | string | User first name            |
| last_name        | string | User last name             |
| email            | string | User email address         |
| password         | string | User password              |
| confirm_password | string | User password confirmation |

**Response**

| Field   | Type    | Description       |
| ------- | ------- | ----------------- |
| success | boolean | Success indicator |
| user    | object  | User details      |
| token   | string  | JWT token         |

**Example**

```
curl -XPOST \
  -H 'Content-Type: application/json' \
  -d '{"first_name": "Jim", "last_name": "Bob", "email": "jim@bob.com", "password": "foobar", "confirm_password": "foobar"}' \
  https://players-api.developer.alchemy.codes/api/user
```

### User Login

Login an admin user.

**POST** /api/login

**Arguments**

| Field    | Type   | Description        |
| -------- | ------ | ------------------ |
| email    | string | User email address |
| password | string | User password      |

**Response**

| Field   | Type    | Description       |
| ------- | ------- | ----------------- |
| success | boolean | Success indicator |
| user    | object  | User details      |
| token   | string  | JWT token         |

**Example**

```
curl -XPOST \
  -H 'Content-Type: application/json' \
  -d '{"email": "jim@bob.com", "password": "foobar"}' \
  https://players-api.developer.alchemy.codes/api/login
```

### Player API

Players are managed by users, which are identified by a JWT.

Players consist of the following information:

```json
{
  "first_name": "<string>",
  "last_name": "<string>",
  "rating": "<number",
  "handedness": "left|right"
}
```

### List Players

List all current players in the system. Players are scoped to the current user.

**GET** /api/players

**Headers**

| Name          | Description                 |
| ------------- | --------------------------- |
| Authorization | JWT passed in bearer format |

**Response**

| Field   | Type    | Description       |
| ------- | ------- | ----------------- |
| success | boolean | Success indicator |
| players | array   | List of players   |

**Example**

```
curl -XGET \
  -H 'Authorization: Bearer <my_jwt_token>' \
  https://players-api.developer.alchemy.codes/api/players
```

### Create Player

Create new player in the system. Players must have unique first name / last name combinations.

**POST** /api/players

**Headers**

| Name          | Description                 |
| ------------- | --------------------------- |
| Authorization | JWT passed in bearer format |

**Arguments**

| Field      | Type   | Description                       |
| ---------- | ------ | --------------------------------- |
| first_name | string | Player first name                 |
| last_name  | string | Player last name                  |
| rating     | string | Player rating                     |
| handedness | enum   | Player handedness (left or right) |

**Response**

| Field   | Type    | Description        |
| ------- | ------- | ------------------ |
| success | boolean | Success indicator  |
| player  | object  | Player information |

**Example**

```
curl -XPOST \
  -H 'Authorization: Bearer <my_jwt_token>' \
  -H 'Content-Type: application/json' \
  -d '{"first_name": "Ma", "last_name": "Long", "rating": 9000, "handedness": "right"}' \
  https://players-api.developer.alchemy.codes/api/players
```

### Delete players

Delete player from the system.

**DELETE** /api/players/:id

**Headers**

| Name          | Description                 |
| ------------- | --------------------------- |
| Authorization | JWT passed in bearer format |

**Parameters**

| Name | Description       |
| ---- | ----------------- |
| id   | Player identifier |

**Response**

| Field   | Type    | Description       |
| ------- | ------- | ----------------- |
| success | boolean | Success indicator |

**Example**

```
curl -XDELETE \
  -H 'Authorization: Bearer <my_jwt_token>' \
  https://players-api.developer.alchemy.codes/api/players/1
```
