const addCandidate = (newCandidate) => {
  return {
    type: "ADD_CANDIDATE",
    payload: {
      id: newCandidate.id,
      name: newCandidate.name,
      profession: newCandidate.profession,
      status: newCandidate.status,
      date: newCandidate.date,
      level: newCandidate.level
    }
  }
}

const candidateChange = (changedCandidate) => {
  return {
    type: "CANDIDATE_CHANGE",
    payload: {
      id: changedCandidate.id,
      name: changedCandidate.name,
      profession: changedCandidate.profession,
      status: changedCandidate.status,
      date: changedCandidate.date,
      level: changedCandidate.level
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

const interviewAnswer = (answers, id) => {
  return {
    type: "INTERVIEW_ANSWER",
    payload: {
      answers: answers,
      id: id
    }
  }
}

export {addCandidate, candidateChange, deleteCandidate, interviewAnswer};
