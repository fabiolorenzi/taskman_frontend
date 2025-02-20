export const authorize = (value) => {
    return {
        type: "AUTHORIZE",
        payload: value
    };
};