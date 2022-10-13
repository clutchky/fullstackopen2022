import { createSlice } from "@reduxjs/toolkit"

const getId = () => (100000 * Math.random()).toFixed(0)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      const content = action.payload;
      state.push({
        content,
        votes: 0,
        id: getId(),
      })
    },
    addVote(state, action) {
      const id = action.payload;
      const anecdote = state.find(a => a.id === id);
      const votedAnecdote = {
        ...anecdote,
        votes: anecdote.votes + 1
      }
      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : votedAnecdote
      );
    }
  }
});

export const { createAnecdote, addVote } = anecdoteSlice.actions
export default anecdoteSlice.reducer