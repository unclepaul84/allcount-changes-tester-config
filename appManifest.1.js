

A.app({
  
  entities: function (Fields) {
    return {
    
      AllFiledsParent3: {
        fields: {
          name: Fields.text("Name")
        },
        referenceName: "name"
      }
    }
  }
});