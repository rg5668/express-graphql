const { loadFilesSync } = require('@graphql-tools/load-files');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const path = require('path');
// const { buildSchema } = require('graphql');

const app = express();
const port = 4000;

// 스키마 및 리졸벌 등 단위가 커지고 관리가 복잡해지므로, 따로 분리가 가능하다.
// -> buildSchema는 잘 안써야하는걸로...!

// const schema = buildSchema(`
//     type Query {
//         posts: [Post],
//         comments: [Comment]
//     }

//     type Post {
//         id: ID!
//         title: String!
//         description: String!
//         comments: [Comment]
//     }

//     type Comment {
//         id: ID!
//         text: String!
//         likes: Int
//     }
// `);

// @graphql-tools/load-files은 조건을 만족하는 파일들을 불러 올 때 사용
const loadedTypes = loadFilesSync('**/*', {
    extensions: ['graphql'],
});
const loadedResolvers = loadFilesSync(path.join(__dirname, '**/*.resolvers.js'));

// @graphql-tools/schema은 스키마 합칠때 사용.
const schema = makeExecutableSchema({
    typeDefs: loadedTypes,
    resolvers: loadedResolvers,
    // resolvers: {
    //     Query: {
    //         posts: async (parent, args, content, info) => {
    //             const product = await Promise.resolve(parent.posts);
    //             return product;
    //         },
    //         comments: async (parent) => {
    //             const comment = await Promise.resolve(parent.comments);
    //             return comment;
    //         },
    //     },
    // },
});

// const root = {
//     posts: require('./posts/posts.model'),
//     comments: require('./comments/comments.model'),
// };

app.use(
    '/graphql',
    graphqlHTTP({
        schema: schema,
        // rootValue: root,
        // graphiql ui를 통해 데이터 구조 및 확인 가능
        graphiql: true,
    })
);

app.listen(port, () => {
    console.log(`Running a GraphQL API server`);
});
