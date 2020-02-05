## Get teachers by ids 

```GraphQl

query {
  getTeachersByIds(ids: ["5e3aac37f346c05b7ce7c328"]) {
    id
    name
  }
}

```

## Add or update teacher 

```GraphQl

mutation {
  addOrUpdateTeacher(
    teacher: {
      id: "5e3aac37f346c05b7ce7c328"
      name: "skhjasdasas asd asd asd dasdk"
    }
  ) {
    id
    name
  }
}

```


## Delete teacher

```GraphQl

mutation {
  deleteTeacher(    
      id: "5e3aac37f346c05b7ce7c328"
      
  ) 
}

```

