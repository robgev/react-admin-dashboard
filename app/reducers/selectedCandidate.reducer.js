export default function(selectedCandidate = '-1', action) {
  if(action.type === 'CHANGE_SELECTED_CANDIDATE'){
    return action.id;
  }
  return selectedCandidate;
}
