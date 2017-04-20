const deleteCandidate = (candidates, action) => {
  const candidatesCopy = Object.assign({}, candidates);
  delete candidatesCopy[action.payload.id];
  return candidatesCopy;
};

export default function(candidates = {}, action) {
  switch(action.type) {
    case "SET_INITIAL":
      return action.payload.candidates;
    case "ADD_CANDIDATE":
      return {...candidates, [action.payload.candidate.id]: action.payload.candidate};
    case "DELETE_CANDIDATE":
      return deleteCandidate(candidates, action);
  };
  return candidates;
}
