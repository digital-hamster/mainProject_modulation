const CategoryType = {
    HOBBY: {
        name: "HOBBY",
        label: "취미",
    },
    EXERCISE: {
        name: "HOBBY",
        label: "운동",
    },
    ETC: {
        name: "ETC",
        label: "기타",
    },

    has: (category) => {
        return Object.keys(CategoryType).some((el) => CategoryType[el].name === category)
    },
}
