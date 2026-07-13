import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../Api.js'

export const createBookingThunk = createAsyncThunk(
  'booking/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await api.post('/bookings', bookingData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create booking')
    }
  }
)

export const getUserBookings = createAsyncThunk(
  'booking/getUserBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/bookings/my-bookings')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings')
    }
  }
)

export const getSingleBooking = createAsyncThunk(
  'booking/getSingleBooking',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/bookings/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch booking')
    }
  }
)

export const downloadBookingPDF = createAsyncThunk(
  'booking/downloadPDF',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/bookings/${id}/download`, {
        responseType: 'blob'
      })
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.setAttribute('download', `Ticket-${id}.pdf`)
      document.body.appendChild(a)
      a.click()
      a.remove()
      
      window.URL.revokeObjectURL(url)
      return true
    } catch (error) {
      console.error("PDF Download error:", error)
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to download PDF'
      )
    }
  }
)

export const getBookingTickets = createAsyncThunk(
  'booking/getBookingTickets',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/bookings/${bookingId}/tickets`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tickets')
    }
  }
)

export const getMyOwnedTickets = createAsyncThunk(
  'booking/getMyOwnedTickets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/bookings/my-tickets')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your tickets')
    }
  }
)

export const transferTicket = createAsyncThunk(
  'booking/transferTicket',
  async ({ ticketId, email }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/bookings/tickets/${ticketId}/transfer`, { email })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to transfer ticket')
    }
  }
)

export const downloadTicketPDF = createAsyncThunk(
  'booking/downloadTicketPDF',
  async ({ ticketId, ticketCode }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/bookings/tickets/${ticketId}/download`, {
        responseType: 'blob'
      })
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.setAttribute('download', `Ticket-${ticketCode}.pdf`)
      document.body.appendChild(a)
      a.click()
      a.remove()
      
      window.URL.revokeObjectURL(url)
      return true
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to download ticket PDF')
    }
  }
)

const initialState = {
  bookings: [],
  tickets: [],
  myTransferredTickets: [],
  currentBooking: null,
  selectedTickets: 1,
  loading: false,
  error: null,
  step: 1, // 1: Select, 2: Confirm, 3: Success
}

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setSelectedTickets(state, action) {
      state.selectedTickets = action.payload
    },
    setCurrentBooking(state, action) {
      state.currentBooking = action.payload
    },
    clearCurrentBooking(state) {
      state.currentBooking = null
      state.selectedTickets = 1
      state.step = 1
    },
    setStep(state, action) {
      state.step = action.payload
    },
    clearBookingError(state) {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Create Booking
    builder.addCase(createBookingThunk.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(createBookingThunk.fulfilled, (state, action) => {
      state.loading = false
      state.currentBooking = action.payload.booking
      state.bookings.unshift(action.payload.booking)
      state.step = 3 // move to success
    })
    builder.addCase(createBookingThunk.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    // Get User Bookings
    builder.addCase(getUserBookings.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(getUserBookings.fulfilled, (state, action) => {
      state.loading = false
      state.bookings = action.payload.bookings
    })
    builder.addCase(getUserBookings.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    // Get Single Booking
    builder.addCase(getSingleBooking.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(getSingleBooking.fulfilled, (state, action) => {
      state.loading = false
      const idx = state.bookings.findIndex(b => b._id === action.payload.booking?._id)
      if (idx !== -1) {
        state.bookings[idx] = action.payload.booking
      } else if (action.payload.booking) {
        state.bookings.push(action.payload.booking)
      }
      state.currentBooking = action.payload.booking
    })
    builder.addCase(getSingleBooking.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    // Get Booking Tickets
    builder.addCase(getBookingTickets.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(getBookingTickets.fulfilled, (state, action) => {
      state.loading = false
      state.tickets = action.payload.tickets
    })
    builder.addCase(getBookingTickets.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    // Get My Owned Tickets
    builder.addCase(getMyOwnedTickets.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(getMyOwnedTickets.fulfilled, (state, action) => {
      state.loading = false
      state.myTransferredTickets = action.payload.tickets
    })
    builder.addCase(getMyOwnedTickets.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    // Transfer Ticket
    builder.addCase(transferTicket.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(transferTicket.fulfilled, (state, action) => {
      state.loading = false
      const idx = state.tickets.findIndex(t => t._id === action.payload.ticket?._id)
      if (idx !== -1) {
        state.tickets[idx] = action.payload.ticket
      }
    })
    builder.addCase(transferTicket.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
  }
})

export const {
  setSelectedTickets, setCurrentBooking, clearCurrentBooking,
  setStep, clearBookingError
} = bookingSlice.actions

export default bookingSlice.reducer
