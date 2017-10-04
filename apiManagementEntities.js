

A.app({

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
    }
  ],

  entities: function (Fields) {
    return {
      ApiDefinition: {
        title: "API Definition",
        fields: {

          name: Fields.text("API Name").required().unique(),
          apiPolicy: Fields.reference("Policy", "ApiThrottlePolicy").required(),
          notes: Fields.textarea("Notes")
        },

        referenceName: "name",
        afterUpdate: function (NewEntity, OldEntity, Security, Q, Crud, AzureEventGridPublisher, Console, ObjectId) {
          // push out api definition    
          return Security.asSystem(function () {



          });
        }
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
        referenceName: "policyName",
        afterUpdate: function (NewEntity, OldEntity, Security, Q, Crud, AzureEventGridPublisher, Console, ObjectId) {
          // push out all keys with overrides
          // push out all api definitions    
          return Security.asSystem(function () {

            function Send() {

              AzureEventGridPublisher.publish('apiThrottlePolicy_update', null, payload);
            }

            let policyId = 0;

            if (OldEntity) {
              policyId = OldEntity.id;

            } else {
              policyId = NewEntity.id;
            }

            return Crud.crudForEntityType('ApiThrottlePolicy').readEntity(policyId).then(throttlePol => {

              let payload = {

                "apiThrottlePolicy": throttlePol,
                "apiDefinitions": []

              };

              ///attach all api definitions which reference this policy
              return Crud.crudForEntityType('ApiDefinition').find({ 'apiPolicy.id': ObjectId(throttlePol.id) }).then(apiDefinitions => {


                apiDefinitions.forEach(function (element) {

                  payload.apiDefinitions.push(element);

                });

                Send();

                return Q(null);
              }).then(x => {

                //send out api key updates for any keys which have this policy explicitely set
                return Crud.crudForEntityType('ApiKey').find({ 'apiPolicy.id': ObjectId(throttlePol.id) }).then(keys => {

                  keys.forEach(function (apiKey) {

                    PublishApiKeyChanged(apiKey, Crud, Console, AzureEventGridPublisher)

                  });

                  return Q(null);

                });

              }).catch(x => Console.warn(x));
            });

          });

        }
      },
      ApiKey: {
        title: "API Key",
        fields: {
          keyName: Fields.text("Key Name").required().unique(),
          apis: Fields.multiReference("API Assignments", "ApiDefinition").required(),
          key: Fields.text("API Key").readOnly(),
          apiPolicy: Fields.reference("Policy Override", "ApiThrottlePolicy"),
          isActive: Fields.checkbox("Is Active"),
          notes: Fields.textarea("Notes")
          /* TODO: maybe add expiration date */
        },
        beforeCreate: function (Entity, Q, UUID) {

          Entity.key = UUID().toUpperCase(); // assign autogenerated guid as api key

          return Q(null);
        },
        afterUpdate: function (NewEntity, OldEntity, Security, Q, Crud, AzureEventGridPublisher, Console, ObjectId) {
          // need to package key and any policy overrides
          return Security.asSystem(function () {

            let apiKeyId = 0;

            if (OldEntity) {
              apiKeyId = OldEntity.id;

            } else {
              apiKeyId = NewEntity.id;
            }

            return Crud.crudForEntityType('ApiKey').readEntity(apiKeyId).then(apiKey => {

              return PublishApiKeyChanged(apiKey, Crud, Console, AzureEventGridPublisher)

            }).catch(x => Console.warn(x));

          });

        }
      }

    }
  }
});

function PublishApiKeyChanged(apiKey, Crud, Console, AzureEventGridPublisher) {

  let payload = {};

  payload["apiKey"] = apiKey;

  if (apiKey.apiPolicy) {

    Crud.crudForEntityType('ApiThrottlePolicy').readEntity(apiKey.apiPolicy.id).then(throttlePolicy => {

      payload["apiPolicy"] = throttlePolicy;

      Send();

    }).catch(x => Console.warn(x));;

  } else {

    Send();
  }

  function Send() {

    AzureEventGridPublisher.publish('apiKey_update', null, payload);
  }

  return Q(null);
}