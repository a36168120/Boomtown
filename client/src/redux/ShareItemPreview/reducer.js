// These are the actions
const UPDATE_ITEMS = "UPDATE_ITEMS";
const RESET_ITEMS = "RESET_ITEMS";
const RESET_ITEM_IMAGE = "RESET_ITEM_IMAGE";

// below are the action creators
export const updateItems = item => ({
  type: UPDATE_ITEMS,
  text: item
});

export const resetItems = () => ({
  type: RESET_ITEMS
});

export const resetItemImage = () => ({
  type: RESET_ITEM_IMAGE
});

// This is the init State
const initState = {
  title: "Name your Item",
  description: "Describe your item",
  created: "New Date()",
  itemowner: {},
  tags: [],
  imageurl: "http://via.placeholder.com/350x250?text=Please select an image"
};

// Here is the reducer
export default (state = initState, action) => {
  switch (action.type) {
    case UPDATE_ITEMS: {
      return {
        ...state,
        ...action.text
      };
    }

    case RESET_ITEMS: {
      return {
        ...initState
      };
    }

    case RESET_ITEM_IMAGE: {
      return {
        ...state,
        imageurl: initState.imageurl
      };
    }
    default:
      return state;
  }
};
