

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
      }

    }
  }
});