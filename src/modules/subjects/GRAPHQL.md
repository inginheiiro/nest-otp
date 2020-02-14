## Get subjects by ids 

```GraphQl
query {
  getSubjectsByIds(ids: ["5e3aac37f346c05b7ce7c328"]) {
    _id
    name
  }
}
```
## Get Subjects

```GraphQl
query {
  getSubjects {
    _id
    name
  }
}

```
 
## Add or update subject
### pass ID for update and existent subject
```GraphQl
mutation {
  addOrUpdateSubject(
    subject: {      
      id:"5e42822a04a72ba6d8cc6a1a"  
      name: "skhjasdasas asd asd asd dasd asd asd asdk"
      description :"jsdhkajsdhkajsdhkas"      
    }
  ) {
    _id
    name
  }
}
```



## Join teachers to subject
### Pass subject id's
### Pass array of existent teachers id's 

```GraphQl
mutation {
  joinTeachersToSubject(
    subjectId: "5e42822a04a72ba6d8cc6a1a"
    teacherIds: ["5e427796c061df252cf1d7d8","5e427796c061df252cf1d7d7"]
  ) {
		teachers {email}
  }
}
```


## Delete subject

```GraphQl

mutation {
  deleteSubject(    
      id: "5e3aac37f346c05b7ce7c328"
      
  ) 
}

```

