 
## Add or update class
### pass ID for update and existent class
```GraphQl
mutation {
  addOrUpdateClass(
    data: {            
      name: "Turma A"     
      year : 1 
      start :"2020-02-06"
      end: "2021-08-31"
    }
  ) {    
    name
  }
}
```


## Join students to class
### Pass class id
### Pass array of existent student id's 

```GraphQl
mutation {
  joinStudentsToClass(
    classId: "5e42822a04a72ba6d8cc6a1a"
    studentIds: ["5e427796c061df252cf1d7d8","5e427796c061df252cf1d7d7"]
  ) {
		students {name}
  }
}
```


## Join managers to class
### Pass class id
### Pass array of existent teachers id's 

```GraphQl
mutation {
  joinManagersToClass(
    classId: "5e42822a04a72ba6d8cc6a1a"
    teacherIds: ["5e427796c061df252cf1d7d8","5e427796c061df252cf1d7d7"]
  ) {
		students {name}
  }
}
```
