

A.app({
  appName: "AllCount Feature Demo",
  appIcon: "line-chart",
  onlyAuthenticated: true,

  adal: {
    tenant: "paulkotlyarhotmail.onmicrosoft.com",
    appId: "a0cad9b7-ac41-4470-9df3-494aea3f327d",
    appSecret: "DM0O9GndzCsGiAX0Jtda8z8fmn8BKk0l8FgXU2lDfnc=",
    authorizedAADGroups: ['Company Administrator'],
    aadGroup2RoleMapping: [{ group: "Company Administrator", role: "admin" }, { group: "allcountmanagers", role: "manager" }],
    isDefaultLoginMethod: true
  },
  azureEventGridPublish: {
    url: 'https://pkallcounttester.westus2-1.eventgrid.azure.net/api/events',
    key: 'Kx6RwkxJzb70sRJ7phy3AtSQpQ4NLWkLVRyQyWJDOHA=',
    autoPublishCrudActions: true,
  },
  forceLocale: 'en',
  menuItems: [

    {
      name: "API",
      icon: "list",
      children: [
        {
          name: "API Definitions",
          entityTypeId: "ApiDefinition"
        },
        {
          name: "API Keys",
          entityTypeId: "ApiKey"
        },
        {
          name: "API Throttle Policies",
          entityTypeId: "ApiThrottlePolicy"
        }

      ]
    },
    {
      name: "Foo 2",
      entityTypeId: "Foo"
    },
    {
      name: "Misc",
      icon: "list",
      children: [{
        name: "AllFileds",
        icon: "table",
        entityTypeId: "AllFileds"


      },
      {
        name: "AllFiledsParent",
        icon: "table",
        entityTypeId: "AllFiledsParent"

      },
      {
        name: "AllFiledsView",
        icon: "table",
        entityTypeId: "AllFiledsView"

      }

      ]

    }

  ],
  roles: ['owner', 'manager'],
  entities: function (Fields) {
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

          json: Fields.json("Json", {
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

        },
        afterUpdate: function (NewEntity, OldEntity, AzureEventGridPublisher) {

          if (NewEntity)
            AzureEventGridPublisher.publish('newFoo', 'urn://Allcount', NewEntity);
          else
            AzureEventGridPublisher.publish('updateFoo', 'urn://Allcount', OldEntity);
        }
      },
      ApiDefinition: {
        title: "API Definition",
        fields: {

          name: Fields.text("API Name").required().unique(),
          apiPolicy: Fields.reference("Policy", "ApiThrottlePolicy").required(),
          notes: Fields.textarea("Notes")
        },

        referenceName: "name"


      },
      ApiThrottlePolicy:
      {
        title: "API Throttle Policy",
        fields: {
          policyName: Fields.text("Policy Name").required().unique(),
          notes: Fields.textarea("Notes"),
          policy: Fields.json("Policy", {

            $ref: "/jsonschemas/throttle-policy.json"

          }).required(),

        },
        referenceName: "policyName"
      },
      ApiKey: {
        title: "API Key",
        fields: {
          keyName: Fields.text("Key Name").required().unique(),
          apis: Fields.multiReference("API Assignments", "ApiDefinition"),
          key: Fields.text("API Key").readOnly(),
          apiPolicy: Fields.reference("Policy Override", "ApiThrottlePolicy"),
          isActive: Fields.checkbox("Is Active"),
          notes: Fields.textarea("Notes")
          /* TODO: maybe add expiration date */
        },
        beforeCreate: function (Entity, Q, UUID) {

          Entity.key = UUID().toUpperCase();

          return Q(null);
        }
      },

      AllFileds: {
        fields: {
          text: Fields.text("Text"),
          textArea: Fields.textarea("TextArea"),
          date: Fields.date("Date"),
          barReference: Fields.reference("Reference", "AllFiledsParent"),
          barMultiReference: Fields.multiReference("Multi Reference", "AllFiledsParent"),
          money: Fields.money("Money"),
          integer: Fields.integer("Integer"),
          checkbox: Fields.checkbox("Checkbox"),
          checkboxArrayField: Fields.checkbox("Checkbox1", 'checkboxArray'),
          checkboxArrayField2: Fields.checkbox("Checkbox2", 'checkboxArray'),
          password: Fields.password("Password"),

          attachment: Fields.attachment("Attachment"),
          link: Fields.link("Link"),
          email: Fields.email("Email"),
          radio: Fields.radio("Radio", ["Option 1", "Option 2", "Option 3"]),
          car: Fields.json("Car", {

            $ref: "/jsonschemas/car.json"

          }),

          customerModel: Fields.json("Customer Model", {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "additionalProperties": true,
            "title": "Customer Model",
            "definitions": {},
            "type": "object",
            "id": "https://ftoptions.com/schemas",
            "defaultProperties": [
              "TheoModel",
              "CurrMarkStyle",
              "PrevMarkStyle",
              "RiskMatrixEnableSurfaceVols"
            ],
            "properties": {
              "TheoModel": {
                "type": "string",
                "id": "/properties/TheoModel",
                "title": "Theo Model",
                "default": "MH",
                "format": "text",
                "description": "Which Model to use",
                "enum": [
                  "MH",
                  "FT",
                ]
              },
              "CurrMarkStyle": {
                "type": "string",
                "id": "/properties/CurrMarkStyle",
                "title": "CurrMarkStyle",
                "default": "MarkToMid",
                "format": "text",
                "description": "Mark method to use for current PNL",
                "enum": [
                  "MarkToMid",
                  "MarkToLast",
                  "MarkToTheo",
                  "MarkToFTSmartMark"

                ]
              },
              "PrevMarkStyle": {
                "type": "string",
                "id": "/properties/PrevMarkStyle",
                "title": "PrevMarkStyle",
                "default": "OpeningPosition",
                "format": "text",
                "description": "Mark method to use for prev PNL",
                "enum": [
                  "MarkToMid",
                  "MarkToLast",
                  "MarkToTheo",
                  "MarkToFTSmartMark"

                ]
              },
              "RiskMatrixEnableSurfaceVols": {
                "type": "boolean",
                "id": "/properties/RiskMatrixEnableSurfaceVols",
                "title": "RiskMatrixEnableSurfaceVols",
                "format": "checkbox",
                "default": true,
                "description": "Enable surface vols in risk matrix"
              }
            }
          })
        },
        views: {
          AllFiledsView: {
            title: 'AllFiledsView Limited',
            showInGrid: ['text', 'integer'],
            filtering: { integer: { $gt: 100 } },
            sorting: [['integer', -1]],
            actions: [
              {
                id: 'DeleteAll',
                name: "DeleteAll",
                perform: function (Crud, User, Actions, Security) {


                  return Actions.modalResult('test', 'test');


                },


                actionTarget: 'all-items'
              }
            ]
          }

        },
        actions: [
          {
            id: 'proceed',
            name: "SetCheckboxFalse",
            perform: function (Crud, User, Actions, Security) {

              var crud = Crud.actionContextCrud();
              return crud.readEntity(Actions.selectedEntityId()).then(function (entity) {
                entity.checkbox = false;
                return crud.updateEntity(entity);
              }).then(function () {
                return Actions.modalResult('test', 'test');
              });

            },
            enabled: function (Crud, Actions) {

              var crud = Crud.actionContextCrud();
              return crud.readEntity(Actions.selectedEntityId()).then(function (entity) {
                return entity.checkbox == true;
              });
            },


            actionTarget: 'single-item'
          }
        ]

      },
      AllFiledsParent: {
        fields: {
          name: Fields.text("Name"),
          myAllFileds: Fields.relation('My All Fields', 'AllFileds', 'barReference'),
        },
        referenceName: "name"
      }
    }
  }
});