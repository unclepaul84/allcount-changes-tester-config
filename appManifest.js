A.app({
    appName: "Field permissions",
    adalTenant: "paulkotlyarhotmail.onmicrosoft.com",  
    adalAppId: "a0cad9b7-ac41-4470-9df3-494aea3f327d",
    adalAppSecret: "DM0O9GndzCsGiAX0Jtda8z8fmn8BKk0l8FgXU2lDfnc=",
    
    adal: {
        tenant: "paulkotlyarhotmail.onmicrosoft.com",  
        appId: "a0cad9b7-ac41-4470-9df3-494aea3f327d",
        appSecret: "DM0O9GndzCsGiAX0Jtda8z8fmn8BKk0l8FgXU2lDfnc=",
        authorizedAADGroups: ['Company Administrator'],
        aadGroup2RoleMapping: [ {group: "Company Administrator", role: "admin"}, {group: "allcountmanagers", role: "manager"}]
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
                    file: Fields.attachment("doc"),
                    
                    json:Fields.json("Json", {
          type: "object",
          title: "Big Automobile",
          properties: {
            make: {
              type: "string",
              enum: [
                "Toyota",
                "BMW",
                "Honda",
                "Ford",
                "Chevy",
                "VW"
              ]
            },
            model: {
              type: "string"
            },
            year: {
              type: "integer",
              enum: [
                1995,1996,1997,1998,1999,
                2000,2001,2002,2003,2004,
                2005,2006,2007,2008,2009,
                2010,2011,2012,2013,2014
              ],
              default: 2008
            }
          }     
      }),                
                    ownerOnly: Fields.text("Foo and Bar").permissions({
                        read: ['owner']
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