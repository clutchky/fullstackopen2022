const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();
const Book = require('./models/book');
const Author = require('./models/author');
const User = require('./models/user');

const jwt_secret = process.env.JWT_SECRET;

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
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: 'UNAUTHENTICATED',
          }
        })
      }
      
      if (author) {
        const bookWithAuthor = new Book({...args, author: author.id})
        
        try {
          await bookWithAuthor.save();
        } catch (error) {
            throw new GraphQLError(error.message, {
              extensions: {
                code: 'BAD_USER_INPUT',
              }
            })
        }

        pubsub.publish('BOOK_ADDED', { bookAdded: bookWithAuthor })

        return bookWithAuthor
      }

      const newAuthor = new Author({ name: args.author })
      const book = new Book({...args, author: newAuthor});

      try {
        await newAuthor.save();
        await book.save();
      } catch (error) {
          throw new GraphQLError(error.message, {
            extensions: {
              code: 'BAD_USER_INPUT',
            }
          })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book
    },
    addAuthor: async (root, args) => {
      const author = new Author({...args});

      try {
        await author.save();
      } catch (error) {
          throw new GraphQLError(error.message, {
            extensions: {
              code: 'BAD_USER_INPUT',
            }
          })
      }

      return author
    },
    editAuthor: async (root, args, context) => {
      const author = await Author.findOne({name: args.name});
      const currentUser = context.currentUser;

      if(!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: 'UNAUTHENTICATED',
          }
        })
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
          throw new GraphQLError(error.message, {
            extensions: {
              code: 'BAD_USER_INPUT',
            }
          })
        }
      )
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if(!user || args.password !== 'secrets') {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const userForToken = {
        user: user.username,
        id: user._id
      };

      return { value: jwt.sign(userForToken, jwt_secret) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

module.exports = resolvers