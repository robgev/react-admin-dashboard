const setInitialPositions = (positions) => {
  return {
    type: "SET_INITIAL_POSITIONS",
    positions: positions
  }
};

const addPosition = (newPosition) => {
  return {
    type: "ADD_NEW_POSITION",
    payload: {
      positionName: newPosition.positionName,
      id: newPosition.id
    }
  }
};

const deletePosition = (id) => {
  return {
    type: "DELETE_POSITION",
    id: id
  }
}

export {setInitialPositions, addPosition, deletePosition};
