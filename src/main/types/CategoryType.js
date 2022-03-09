const CategoryType = {
    PIZZA: {
        name: "PIZZA",
        //label: "피자", //프론트에게 가는 설명으로 이해했지만, 오히려 혼란올 것 같아서 뺏습니다 ㅠ
    },
    CHICKEN: {
        name: "CHICKEN",
    },
    BURGER: {
        name: "BURGER",
    },
    CHINESE: {
        name: "CHINESE",
    },
    NOODLE: {
        name: "NOODLE",
    },
    PASTA: {
        name: "PASTA",
    },

    has: (category) => {
        return Object.keys(CategoryType).some((el) => CategoryType[el].name === category)
    },
}
module.exports = CategoryType
