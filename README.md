<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

Nest Authentication using Mongoose (Mongo DB) + JWT + Graphql + OTP

### Installing

Clone the repo 

Install required dependencies
```
$ yarn  
```

<strong>Modify .env file</strong>

Generate Graphql schemas 
```
ts-node generate-typings
```

RUN using npm or  
```
nest start --watch --webpack
```

If everything goes well you should have a graphql playground available at

```
http://localhost:3000/graphql
```

# PLAYGROUND

## Register new user 

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

## login and existent user 

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

You can use google authenticator to generate tokens.

```GraphQl

mutation {
  validate(email: "XXX@gmail.com", token: "943639")
}

```

## Authors

- [inginheiiro](https://github.com/inginheiiro)

## License
[MIT licensed](LICENSE).
