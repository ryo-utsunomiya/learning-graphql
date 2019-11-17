const { GraphQLScalarType } = require('graphql');

let id = 0;
const photos = [];
const users = [];

module.exports = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos,
  },
  Mutation: {
    postPhoto(parent, args) {
      const { input } = args;
      console.log(input);
      const newPhoto = {
        id: id++,
        url: input.url,
        name: input.name,
        description: input.description,
        category: input.photoCategory || 'PORTRAIT',
        created: new Date(),
      };
      photos.push(newPhoto);
      return newPhoto;
    }
  },
  Photo: {
    url: parent => `https://example.com/img/${parent.id}.jpg`,
    postedBy: parent => users.find(u => u.githubLogin === parent.githubUser),
    taggedUsers: parent => tags.filter(t => t.photoID === parent.id)
      .map(t => t.userID)
      .map(id => users.find(u => u.githubLogin === id))
  },
  User: {
    postedPhotos: parent => photos.filter(p => p.githubUser === parent.githubLogin),
    inPhotos: parent => tags.filter(t => t.userID === parent.id)
      .map(t => t.photoID)
      .map(id => photos.find(p => p.id === id)),
  },
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A datetime value',
    parseValue: value => new Date(value),
    serialize: value => new Date(value).toISOString(),
    parseLiteral: ast => ast.value,
  }),
};
