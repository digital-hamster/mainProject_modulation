const CategoryType = {
    PIZZA: {
        //name: "PIZZA",
        description: "PIZZA",
    },
    CHICKEN: {
        description: "CHICKEN",
    },
    BURGER: {
        description: "BURGER",
    },
    CHINESE: {
        description: "CHINESE",
    },
    NOODLE: {
        description: "NOODLE",
    },
    PASTA: {
        description: "PASTA",
    },

    has: (category) => {
        return Object.keys(CategoryType).some((el) => CategoryType[el].name === category)
    },
}
module.exports = CategoryType
