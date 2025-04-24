export const chrome = {
    storage: {
        local: {
            get: jest.fn(),
            set: jest.fn().mockResolvedValue(undefined),
        },
    },
};
