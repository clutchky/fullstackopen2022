require('dotenv').config();
const { ApolloServer, gql, UserInputError, AuthenticationError } = require('apollo-server')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { v1:uuid } = require('uuid')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const url = process.env.MONGODB_URI;
const jwt_secret = process.env.JWT_SECRET;

mongoose.connect(url)
  .then(result => {
    console.log('connected to mongodb')
  })
  .catch((error) => {
    console.error('error connecting to mongodb', error.message)
  })

const typeDefs = gql`

  enum YesNo{
    YES
    NO
  }

  type Book {
    title: String!
    author: Author
    published: Int!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int
  }

  type User {
    username: String!
    favouriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Mutation {
    addBook(
      title: String!
      author: String
      published: Int!
      genres: [String!]!
    ): Book!
    addAuthor(
      name: String!
      born: Int
    ): Author
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favouriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: YesNo, genres: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if(args.genres) {
        return Book.find({"genres": args.genres})
      }

      if(!args.author || !args.genres) {
        return Book.find({});
      }

      return Book.find({ author: { $exists: args.author === 'YES' } });
    },
    allAuthors: async () => {
      return Author.find({});
    },
    me: async (root, args, context) => {
      return context.currentUser
    }
  },
  Book: {
    author: async (root) => {
      const book = root.author
      const author = await Author.findById(book)
      return author
    }
  },
  Author: {
    bookCount: async (root) => {
      const authorBooks = await Book.count({ author: root.id })
      return authorBooks
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      
      const author = await Author.findOne({ name: args.author });
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }
      
      if (author) {
        const bookWithAuthor = new Book({...args, author: author.id})
        
        try {
          await bookWithAuthor.save();
        } catch (error) {
            throw new UserInputError(error.message, {
              invalidArgs: args,
            })
        }

        return bookWithAuthor
      }

      const newAuthor = new Author({ name: args.author })
      const book = new Book({...args, author: newAuthor});

      try {
        await newAuthor.save();
        await book.save();
      } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
      }

      return book
    },
    addAuthor: async (root, args) => {
      const author = new Author({...args});

      try {
        await author.save();
      } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
      }

      return author
    },
    editAuthor: async (root, args, context) => {
      const author = await Author.findOne({name: args.name});
      const currentUser = context.currentUser;

      if(!currentUser) {
        throw new AuthenticationError("not authenticated");
      }

      author.born = args.setBornTo

      if(!author) {
        return null
      }
      
      return author.save();
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favouriteGenre: args.favouriteGenre })

      return user.save()
        .catch (error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
      )
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if(!user || args.password !== 'secrets') {
        throw new UserInputError('wrong credentials');
      }

      const userForToken = {
        user: user.username,
        id: user._id
      };

      return { value: jwt.sign(userForToken, jwt_secret) }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null

    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), jwt_secret
      )

      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})