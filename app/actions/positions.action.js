const setInitialPositions = (positions) => {
  return {
    type: "SET_INITIAL_POSITIONS",
    positions
  }
};

const addPosition = (position) => {
  return {
    type: "ADD_NEW_POSITION",
    position
  }
};

const deletePosition = (id) => {
  return {
    type: "DELETE_POSITION",
    id
  }
}

export {setInitialPositions, addPosition, deletePosition};
