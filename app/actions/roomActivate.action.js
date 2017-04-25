export const roomActivate = (payload) => {
    return {
      type: 'ACTIVE_ROOM',
      payload
    }
}

export const initialRooms = (rooms) => {
  return {
    type: 'SET_INITIAL_ROOMS',
    rooms
  }
}
