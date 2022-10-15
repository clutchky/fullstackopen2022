import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from "../services/anecdotes";

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
    updatedAnecdotes(state, action) {
      const id = action.payload.id;
      return state.map(anecdote => 
        anecdote.id !== id ? anecdote : action.payload
      );
    }
  }
});

export const { appendAnecdote, setAnecdotes, updatedAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  }
};

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(newAnecdote));
  }
};

export const addVote = (id, anecdote) => {
  return async dispatch => {
    const votedAnecdote = await anecdoteService.incrementVote(id, anecdote);
    dispatch(updatedAnecdotes(votedAnecdote));
  }
}

export default anecdoteSlice.reducer