export const DBConfig = {
    name: "MyDB",
    version: 1,
    objectStoresMeta: [
      {
        store: "Users",
        storeSchema: [
          { name: "name", keypath: "name", options: { unique: false } },
          { name: "email", keypath: "email", options: { unique: true } },
          { name: "password", keypath: "password", options: { unique: false } },
          { name: "favourite", keypath: "favourite", options: { unique: false } },
        ],
      },
    ],
  };