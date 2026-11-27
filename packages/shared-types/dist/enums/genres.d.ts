declare const Genre: {
    readonly ESSAYS: "essays";
    readonly POETRY: "poetry";
    readonly APOCALYPTIC: "apocalyptic";
    readonly DYSTOPIAN: "dystopian";
    readonly MYSTERY: "mystery";
    readonly SCI_FI: "sci-fi";
    readonly FANTASY: "fantasy";
};
type Genre = (typeof Genre)[keyof typeof Genre];
export { Genre };
