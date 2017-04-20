import { combineReducers } from 'redux';
import activeRoomReducer from './activeRoom.reducer';
import candidatesReducer from './candidates.reducer';
import interviewQuestionsReducer from './interviewQuestions.reducer';
import loginReducer from './login.reducer';
import roomListReducer from './roomlist.reducer';
import positionsReducer from './positions.reducer';

export const allReducers = combineReducers({
  loggedIn: loginReducer,
  rooms: roomListReducer,
  activeRoom: activeRoomReducer,
  candidates: candidatesReducer,
  questions: interviewQuestionsReducer,
  positions: positionsReducer
});
