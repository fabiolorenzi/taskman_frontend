const authorizeReducer = (state = false, action) => {
    switch (action.type) {
        case "AUTHORIZE":
            return state = action.payload;
        default:
            return state;
    };
};

export default authorizeReducer;