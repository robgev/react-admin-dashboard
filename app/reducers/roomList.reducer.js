const firstRender = [
  {
    name: 'All',
    class: 'a',
    index: 0,
    descr: 'All rooms',
    color: 'black'
  }
];

export default (rooms = firstRender, action) => {
  if(action.type === 'SET_INITIAL_ROOMS') {
    return action.rooms
  }
  return rooms;
}
