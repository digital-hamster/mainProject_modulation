module.exports = {
    enumToArray: (Enum) => {
        return Object.keys(Enum)
            .filter((key) => Enum[key].description)
            .map((key) => ({ description: Enum[key].description, value: key }))
    },
}
