import {addCandidateFirebase} from '../lib/firebaseAPI';
import firebase from 'firebase';

const addCandidate = (candidates, info) => {
  candidates[info.id] = info.candidate;
  return candidates;
};

const deleteCandidate = (candidates, action) => {
  delete candidates[action.payload.id];
  return candidates;
};

export default function(candidates = {}, action) {
  const candidatesCopy = Object.assign({}, candidates);
  switch(action.type) {
    case "SET_INITIAL":
      return action.payload.candidates;
    case "ADD_CANDIDATE":
      return addCandidate(candidatesCopy, action.payload);
    case "DELETE_CANDIDATE":
      return deleteCandidate(candidatesCopy, action);
  };
  return candidates;
}
