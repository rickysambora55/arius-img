export const idData = (prefix, offset = 0) => {
    return {
        trim: true,
        customSanitizer: {
            options: (value) =>
                value === "" || value === "null" ? null : parseInt(value),
        },
        custom: {
            options: (value) =>
                value === null || (Number.isInteger(value) && value >= offset),
            errorMessage: `${
                (prefix || "") + " "
            }ID must be a positive integer or null!`,
        },
    };
};

export const rankTypeValidation = {
    trim: true,
    notEmpty: { errorMessage: "Rank type is required!" },
    isString: {
        errorMessage: "Rank type must be a string!",
    },
    isIn: {
        options: [["ta", "ga"]],
        errorMessage: "Rank type must be either 'ta' or 'ga'!",
    },
};
export const seasonValidation = idData("Season", 1);

export const seasonFilter = {
    type: rankTypeValidation,
    season: seasonValidation,
};
