# Pococare_Backend

## Deployed Link :- https://dull-lime-fly-vest.cyclic.app/

## Build REST API's with

- NodeJs
- ExpressJs

## Data Stored in MongoDB

</br>

## Steps of starting Backend

1. Run `npm run start` on terminal
2. You will get `URL` like this `http://localhost:7878` server running on port number `7878`

## Methods

# 1. Signup

### Signup :- `http://localhost:7878/auth/signup`

## Email and password saved in the mongodb, password stored in hashed formate.

```json
{
  "email": "demo@gmail.com",
  "password": "demo"
}
```

```javascript
http://localhost:7878/auth/signup
```

# 2. Login

### Login :- `http://localhost:7878/auth/login`

## After giving right credential system provided two different token

1. Access Token: which has expired time round 3 min
2. Refresh Token: which has expired time round 5 min, by this token we can refresh or create new access token for our app.

```json
{
  "email": "demo@gmail.com",
  "password": "demo"
}
```

```javascript
http://localhost:7878/auth/login
```

3. Refresh

### Login :- `http://localhost:7878/auth/refresh`

## With the help of this url system will verify token expired date and after verify system generate new token.

1. Access Token: which has expired time round 3 min
2. Refresh Token: which has expired time round 5 min, by this token we can refresh or create new access token for our app.

```javascript
//accept this in headers authorization_refresh
const refreshToken = req.headers["authorization_refresh"];
```

```javascript
http://localhost:7878/auth/refresh
```

4. Logout

### Login :- `http://localhost:7878/auth/logout`

## With the help of this url system will logout and access_token and refresh_token stored under backlist data base

1. Access Token: which has expired time round 3 min
2. Refresh Token: which has expired time round 5 min, by this token we can refresh or create new access token for our app.

```javascript
//accept this in headers authorization_refresh &authorization_access
const access_token = req.headers["authorization_access"];
const refresh_token = req.headers["authorization_refresh"];
// console.log('token:', token)
const tokenPushAccess = new blacklistModel({
  blackListItem: access_token,
});
await tokenPushAccess.save();
const tokenPushRefresh = new blacklistModel({
  blackListItem: refresh_token,
});
await tokenPushRefresh.save();
```

```javascript
http://localhost:7878/auth/logout
```

4. Verify

### Login :- `http://localhost:7878/auth/verify`

## By this url user can get details from token

```javascript
//accept body as token
const { token } = req.body;

// then with the help of jwt.verify getting all details under jwt token
const verification = jwt.verify(token, "XXXXXXXX_XX");
```

```javascript
http://localhost:7878/auth/verify
```

5. page

## By this url when user move from one page to other and during that period if user access_token get expired on that time this url help to notified user

- It has middleware (i.e. middleWareAuth) where they verify token expiry and notified to users and base on that this url will run `http://localhost:7878/auth/refresh` and get new token and set new token in headers

```javascript
http://localhost:7878/auth/verify
```
