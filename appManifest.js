A.app({
    appName: "Field permissions",
    adalTenant: "paulkotlyarhotmail.onmicrosoft.com",  
    adalAppId: "a0cad9b7-ac41-4470-9df3-494aea3f327d",
    adalAppSecret: "DM0O9GndzCsGiAX0Jtda8z8fmn8BKk0l8FgXU2lDfnc=",
    
    adal: {
        tenant: "paulkotlyarhotmail.onmicrosoft.com",  
        appId: "a0cad9b7-ac41-4470-9df3-494aea3f327d",
        appSecret: "DM0O9GndzCsGiAX0Jtda8z8fmn8BKk0l8FgXU2lDfnc=",
        authorizedGroups: ['Company Administrator'],
        group2RoleMapping: [ {group: "Company Administrator", role: "admin"}, {group: "allcountmanagers", role: "manager"}]
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