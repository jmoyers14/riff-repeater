import { customAlphabet } from "nanoid";

const ID_ALPHABET = "1234567890abcdefghijklmnopqrstuvwxyz";
const ID_LENGTH = 10;

const nanoid = customAlphabet(ID_ALPHABET, ID_LENGTH);

export const generateId = () => {
    return nanoid();
};
