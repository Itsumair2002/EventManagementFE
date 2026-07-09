import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../Api.js'

export const fetchAIRecommendations = createAsyncThunk(
  'ai/fetchRecommendations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/ai/recommendations?limit=6')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch AI recommendations')
    }
  }
)

export const sendEventMateMessage = createAsyncThunk(
  'ai/sendMessage',
  async (message, { rejectWithValue }) => {
    try {
      const response = await api.post('/ai/chat', { message })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'EventMate could not answer right now')
    }
  }
)

const initialState = {
  recommendations: [],
  recommendationSource: null,
  loadingRecommendations: false,
  recommendationError: null,
  chatLoading: false,
  chatError: null,
}

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearChatError(state) {
      state.chatError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAIRecommendations.pending, (state) => {
        state.loadingRecommendations = true
        state.recommendationError = null
      })
      .addCase(fetchAIRecommendations.fulfilled, (state, action) => {
        state.loadingRecommendations = false
        state.recommendations = action.payload.recommendations || []
        state.recommendationSource = action.payload.source
      })
      .addCase(fetchAIRecommendations.rejected, (state, action) => {
        state.loadingRecommendations = false
        state.recommendationError = action.payload
      })
      .addCase(sendEventMateMessage.pending, (state) => {
        state.chatLoading = true
        state.chatError = null
      })
      .addCase(sendEventMateMessage.fulfilled, (state) => {
        state.chatLoading = false
      })
      .addCase(sendEventMateMessage.rejected, (state, action) => {
        state.chatLoading = false
        state.chatError = action.payload
      })
  },
})

export const { clearChatError } = aiSlice.actions
export default aiSlice.reducer
