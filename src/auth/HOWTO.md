## Register User Mutation 

```GraphQl
query {
  register(email: "XXX@gmail.com") {
    ... on Register {
      QRCode
    }
    ... on AlreadyExists {
      reason
    }
  }
}
```

## login google user 

```GraphQl
query {
  googleLogin(tokenId: "GoogleAuthTokenID") 
}
```


## login user 

```GraphQl
query {
  login(email: "XXX@gmail.com") {
    ... on Login {
      QRCode
    }
    ... on NotFound {
      reason
    }
  }
}
```



## Validate OTP Token 

```GraphQl
query {
  validate(email: "XXX@gmail.com", token: "943639")
}

```
