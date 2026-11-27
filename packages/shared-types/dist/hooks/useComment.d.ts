import type { Comment } from "../types/comment.js";
interface CommentMutation<Data, Variables> {
    data: Data | undefined;
    isPending: boolean;
    isError: boolean;
    error: unknown;
    mutate: (variables: Variables, options?: {
        onSuccess?: (data: Data, variables: Variables) => void;
    }) => void;
    mutateAsync: (variables: Variables) => Promise<Data>;
    reset: () => void;
}
export interface UseCommentHook {
    getComments: {
        data: Comment[] | undefined;
        isPending: boolean;
        isError: boolean;
        error: unknown;
    };
    createComment: CommentMutation<void, string>;
    editComment: CommentMutation<Comment[], {
        commentId: string;
        comment: string;
    }>;
    deleteComment: CommentMutation<Comment[], string>;
}
export {};
