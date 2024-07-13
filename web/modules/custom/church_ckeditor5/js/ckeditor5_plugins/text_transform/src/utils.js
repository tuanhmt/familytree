export const lowerCase = (text) => {
    return text.toLowerCase();
}

export const upperCase = (text) => {
    return text.toUpperCase();
}

export const sentenceCase = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1, text.length).toLowerCase();
}

export const capitalizeCase = (text) => {
    const words = text.split(" ");

    for (let i = 0; i < words.length; i++) {
        if (words[i] == "") {
            continue;
        }
        words[i] = words[i][0].toUpperCase() + words[i].substr(1).toLowerCase();
    }

    return words.join(" ");
};

/**
 * Text change case function.
 * @param {*} mode 
 * @param {*} text 
 * @returns 
 */
export const changeCase = (mode, text) => {
    let targetText = '';
    switch (mode) {
        case 'upperCase':
        targetText = upperCase(text);
        break;

        case 'lowerCase':
        targetText = lowerCase(text);
        break;

        case 'capitalizeCase':
        targetText = capitalizeCase(text);
        break;

        case 'sentenceCase':
        targetText = sentenceCase(text);
        break;

        default:
        targetText = text;
        break;
    }

    return targetText;
}
