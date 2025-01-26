//books collection validator
export const booksValidator = {
  $jsonSchema: {
    bsonType: "object",
    title: "Student Object Validation",
    required: ["title"],
    properties: {
      title: {
        bsonType: "string",
        description: "title is required",
      },
    },
  },
};
