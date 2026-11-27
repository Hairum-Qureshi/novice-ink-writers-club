export type Comment = {
    id: string;
    storyId: string;
    authorId: string;
    content: string;
    author: {
        id: true;
        firstName: true;
        lastName: true;
        profilePicture: true;
    };
    createdAt: string;
    updatedAt: string;
};
