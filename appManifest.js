A.app({
    adal: {
        tenant: "paulkotlyarhotmail.onmicrosoft.com",  
        appId: "a0cad9b7-ac41-4470-9df3-494aea3f327d",
        appSecret: "DM0O9GndzCsGiAX0Jtda8z8fmn8BKk0l8FgXU2lDfnc=",
        authorizedAADGroups: ['Company Administrator'],
        aadGroup2RoleMapping: [ {group: "Company Administrator", role: "admin"}, {group: "allcountmanagers", role: "manager"}],
        isDefaultLoginMethod: true
    },
    azureEventHubsPublish: {
        connectionString:'Endpoint=sb://pkallcounttester.servicebus.windows.net/;SharedAccessKeyName=sender;SharedAccessKey=Cse3ExAge3Pb0YJoyxTph7NFs5vDCrTqSyGn3ugwqn8=;EntityPath=pkallcounttester',
        path:'pkallcounttester'
        
    },
    forceLocale: 'en',
    menuItems: [
        {
            name: "Foo 2",
            entityTypeId: "Foo"
        }
    ],
    roles: ['owner', 'manager'],
    entities: function(Fields) {
        return {
            Foo: {
                fields: {
                    foo: Fields.text("Foo").regex('aaa').validationMessage("Must start with aaa"),
                    bar: Fields.text("Bar").permissions({
                        write: ['manager']
                    }),
                        ownerOnly: Fields.text("Foo and Bar").permissions({
                        read: ['owner']
                    }),
                    
                    json:Fields.json("Json",{
  "title": "Person",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "First and Last name",
      "minLength": 4,
      "default": "Jeremy Dorn"
    },
    "age": {
      "type": "integer",
      "default": 25,
      "minimum": 18,
      "maximum": 99
    },
    "favorite_color": {
      "type": "string",
      "format": "color",
      "title": "favorite color",
      "default": "#ffa500"
    },
    "gender": {
      "type": "string",
      "enum": [
        "male",
        "female"
      ]
    },
    "location": {
      "type": "object",
      "title": "Location",
      "properties": {
        "city": {
          "type": "string",
          "default": "San Francisco"
        },
        "state": {
          "type": "string",
          "default": "CA"
        },
        "citystate": {
          "type": "string",
          "description": "This is generated automatically from the previous two fields",
          "template": "{{city}}, {{state}}",
          "watch": {
            "city": "location.city",
            "state": "location.state"
          }
        }
      }
    },
    "pets": {
      "type": "array",
      "format": "table",
      "title": "Pets",
      "uniqueItems": true,
      "items": {
        "type": "object",
        "title": "Pet",
        "properties": {
          "type": {
            "type": "string",
            "enum": [
              "cat",
              "dog",
              "bird",
              "reptile",
              "other"
            ],
            "default": "dog"
          },
          "name": {
            "type": "string"
          }
        }
      },
      "default": [
        {
          "type": "dog",
          "name": "Walter"
        }
      ]
    }
  }
})               
                
                }
            },
            CreateOnly: {
                fields: {
                    foo: Fields.text("Foo"),
                    bar: Fields.text("Bar")
                },
                permissions: {
                    read: ['manager'],
                    create: null
                }
            }
        }
    }
});