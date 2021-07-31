const getDirectories = async function () {
    const response = await fetch("http://localhost:3000/dirs", {
        method: "GET"
    });
    const data = await response.json();
    return data;
};

export { getDirectories };