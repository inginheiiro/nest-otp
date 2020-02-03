## Register User Mutation 

```GraphQl
mutation {
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

mutation {
  googleLogin(tokenId: "GoogleAuthTokenID") 
}
```


## login user 

```GraphQl

mutation {
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

mutation {
  validate(email: "XXX@gmail.com", token: "943639")
}

```
