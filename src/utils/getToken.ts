const getToken = () => {
    if (
        typeof window !== "undefined" &&
        !!localStorage.getItem("accessToken")
    ) {
        return localStorage.getItem("accessToken");
    }
};

export default getToken;
