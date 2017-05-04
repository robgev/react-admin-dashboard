const deleteCandidate = (candidates, action) => {
  const candidatesCopy = Object.assign({}, candidates);
  delete candidatesCopy[action.payload.id];
  return candidatesCopy;
};

const addQuestions = (candidates, action) => {
  const {candidateID, questions} = action.payload;
  const candidatesCopy = Object.assign({}, candidates);
  const cand = {...candidatesCopy[candidateID], questions};
  candidatesCopy[candidateID] = cand;
  return candidatesCopy;
}

export default function(candidates = {}, action) {
  switch(action.type) {
    case "SET_INITIAL":
      return action.payload.candidates;
    case "ADD_CANDIDATE":
      return {...candidates, [action.payload.candidate.id]: action.payload.candidate};
    case "DELETE_CANDIDATE":
      return deleteCandidate(candidates, action);
    case "ADD_QUESTIONS_TO_CANDIDATE":
      return addQuestions(candidates, action);
  };
  return candidates;
}
