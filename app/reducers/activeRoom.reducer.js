export default(state = 0, action) => {
    switch (action.type) {
        case 'ACTIVE_ROOM':
            return action.payload
    }
    return state
}
