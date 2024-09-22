const formReducer = (
  state: any,
  action: { type: any; field: any; payload: any }
) => {
  switch (action.type) {
    case "HANDLE INPUT TEXT":
      return {
        ...state,
        [action.field]: action.payload,
      };
    default:
      return state;
  }
};

export default formReducer;

const ACTIONS = {
  HANDLE_ARTISTS: "HANDLE ARTISTS",
};

export const genreBlockReducer = (
  state: any,
  action: { type: any; field: any; payload: any }
) => {
  switch (action.type) {
    case ACTIONS.HANDLE_ARTISTS:
      return {
        ...state,
        [action.field]: action.payload,
      };
    default:
      return state;
  }
};
