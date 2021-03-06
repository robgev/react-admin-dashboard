const addCandidate = (newCandidate) => {
  return {
    type: "ADD_CANDIDATE",
    payload: {
      candidate: {
        name: newCandidate.name,
        profession: newCandidate.profession,
        status: newCandidate.status,
        date: newCandidate.date,
        level: newCandidate.level,
        id: newCandidate.id
      },
    }
  }
}

const deleteCandidate = (id) => {
  return {
    type: "DELETE_CANDIDATE",
    payload: {
      id: id
    }
  }
}

const setInitial = (candidates) => {
  return {
    type: "SET_INITIAL",
    payload: {
      candidates: candidates
    }
  }
}

const addCandidateQuestions = (id, questionIds) => {
  return {
    type: "ADD_QUESTIONS_TO_CANDIDATE",
    payload: {
      candidateID: id,
      questions: questionIds
    }
  }
}

export {addCandidate, deleteCandidate, setInitial, addCandidateQuestions};
