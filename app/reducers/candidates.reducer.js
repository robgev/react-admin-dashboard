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

const editCandidate = (candidates, candidate) => {
  const copy = Object.assign({}, candidates);
  const {id, name, profession, status, date, level} = candidate;
  copy[id].name = name;
  copy[id].profession = profession;
  copy[id].status = status;
  copy[id].date = date;
  copy[id].level = level;
  return copy;
}

export default function(candidates = {}, action) {
  switch(action.type) {
    case "SET_INITIAL":
      return action.payload.candidates;
    case "ADD_CANDIDATE":
      return editCandidate(candidates, action.payload.candidate);
    case "DELETE_CANDIDATE":
      return deleteCandidate(candidates, action);
    case "ADD_QUESTIONS_TO_CANDIDATE":
      return addQuestions(candidates, action);
  };
  return candidates;
}
