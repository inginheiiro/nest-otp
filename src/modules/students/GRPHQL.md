 
## Add or update student
### pass ID for update and existent student
```GraphQl
mutation {
  addOrUpdateStudent(
    student: {     
      nr: 1980       
      name: "Paulo Sérgio"      
      birthDate :"2020-02-06"      
    }
  ) {    
    name,
    photo
  }
}
```


