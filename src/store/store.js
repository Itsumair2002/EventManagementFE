import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice.js'
import eventReducer from './slices/EventSlice.js'
import bookingReducer from './slices/bookingSlice.js'
import uiReducer from './slices/uiSlice.js'
import CategorySlice from './slices/CategorySlice.js'
import EventSlice from './slices/EventSlice.js'
import aiReducer from './slices/aiSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    booking: bookingReducer,
    ui: uiReducer,
    category: CategorySlice,
    event: EventSlice,
    ai: aiReducer
  },
})
