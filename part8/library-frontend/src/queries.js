import { gql } from "@apollo/client";

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    published
    author{
      name
    }
    genres
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }

  ${BOOK_DETAILS}
`

export const ALL_AUTHORS = gql`
  query allAuthors{
    allAuthors{
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      author {
        name
      }
      genres
    }
  }
`

export const ADD_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!){
    addBook (title: $title, author: $author, published: $published, genres: $genres)
    {
      title
      author{
        name
      }
      published
      genres
    }
  }
`

export const EDIT_BIRTHDATE = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor (name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`

export const LOGIN = gql`
mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    value   
  }
}
`

export const ME = gql`
query {
  me {
    username
    favouriteGenre
  }
}
`