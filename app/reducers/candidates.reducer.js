import uuid from 'uuid/v4';
import _ from 'lodash';
const initialState = [
  {
    id: uuid(),
    name: "David Hakobyan",
    profession: "Developer",
    status: "Shortlisted",
    date: new Date("2017-06-14"),
    level: "Intern"
  },
  {
    id: uuid(),
    name: "Ann Brown",
    profession: "Developer",
    status: "Rejected",
    date: new Date("2017-05-14"),
    level: "Junior"
  },
  {
    id: uuid(),
    name: "Maria Sharapova",
    profession: "Designer",
    status: "Accepted",
    date: new Date("2017-06-10"),
    level: "Middle"
  },
  {
    id: uuid(),
    name: "Erik Davtyan",
    profession: "Developer",
    status: "Rejected",
    date: new Date(),
    level: "Senior"
  },
  {
    id: uuid(),
    name: "Hakob Paronyan",
    profession: "Engineer",
    status: "Shortlisted",
    date: new Date("2018-06-14"),
    level: "Junior"
  },
  {
    id: uuid(),
    name: "Hillary Banks",
    profession: "Designer",
    status: "Accepted",
    date: new Date(),
    level: "Junior"
  }
];

const candidateChange = (candidates, action) => {
  const changedCandidate = Object.assign({}, {
    ..._.find(candidates, {id: action.payload.id}),
    name: action.payload.name,
    profession: action.payload.profession,
    status: action.payload.status,
    date: action.payload.date,
    level: action.payload.level
  });
  const index = _.findIndex(candidates, {id: changedCandidate.id});
  candidates[index] = changedCandidate;
  return candidates;
};

const deleteCandidate = (candidates, action) => {
  const deleteIndex = _.findIndex(candidates, {id: action.payload.id});
  candidates.splice(deleteIndex, 1);
  return candidates;
};

const interviewAnswer = (candidates, action) => {
  const {answers, id} = action.payload;
  const answeredCandidate = Object.assign({}, _.find(candidates, {id: id}));
  answers.forEach(answer => {
    answeredCandidate[answer.question] = answer.answer;
  });
  const answeredIndex = _.findIndex(candidates, {id: id});
  candidates[answeredIndex] = answeredCandidate;
  return candidates;
};

export default function(candidates = initialState, action) {
  const candidatesCopy = candidates.slice();
  switch(action.type) {
    case "CANDIDATE_CHANGE":
      return candidateChange(candidatesCopy, action);
    case "ADD_CANDIDATE":
      return [...candidates, action.payload];
    case "DELETE_CANDIDATE":
      return deleteCandidate(candidatesCopy, action);
    case "INTERVIEW_ANSWER":
      return interviewAnswer(candidatesCopy, action);
  };
  return candidates;
}
