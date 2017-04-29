export default function(positions = {}, action) {
  switch(action.type) {
    case "SET_INITIAL_POSITIONS":
      return action.positions;
    case "ADD_NEW_POSITION":
      return {...positions, [action.position.id]: action.position};
    case "DELETE_POSITION":
      const positionsCopy = Object.assign({}, positions);
      delete positionsCopy[action.id];
      return positionsCopy;
  };
  return positions;
};
