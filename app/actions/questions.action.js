const changeQuestion = (info) => {
  return {
    type: "CHANGE_QUESTIONS",
    payload: {
      profession: info.profession,
      level: info.level,
      question: info.question,
      index: info.index
    }
  }
}

const addQuestion = (profession, level) => {
  return {
    type: "ADD_QUESTION",
    payload: {
      profession: profession,
      level: level
    }
  }
}

const removeQuestion = (profession, level, index) => {
  return {
    type: "REMOVE_QUESTION",
    payload: {
      professionR: profession,
      levelR: level,
      indexR: index
    }
  }
}

const addProfession = (position) => {
  return {
    type: "ADD_POSITION",
    payload: {
      newPosition: position
    }
  }
}

const removeProfession = (position) => {
  return {
    type: "REMOVE_POSITION",
    payload: {
      positionToRemove: position
    }
  }
}

export {changeQuestion, addQuestion, removeQuestion, addProfession, removeProfession}
