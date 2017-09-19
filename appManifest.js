A.app({
    appName: "Field permissions",
    adalTenant: "paulkotlyarhotmail.onmicrosoft.com",  
    adalAppId: "a0cad9b7-ac41-4470-9df3-494aea3f327d",
    adalAppSecret: "DM0O9GndzCsGiAX0Jtda8z8fmn8BKk0l8FgXU2lDfnc=",
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