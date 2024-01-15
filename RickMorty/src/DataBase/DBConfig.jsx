export const DBConfig = {
  storageType: "localStorage", 
  name: "MyDB",
  objectStoresMeta: [
    {
      store: "Users",
      storeSchema: [
        { name: "name", keypath: "name" },
        { name: "email", keypath: "email", options: { unique: true } },
        { name: "password", keypath: "password" },
        { name: "favourite", keypath: "favourite" },
        { name: "profile", keypath: "profile" },
      ],
    },
  ],
};
