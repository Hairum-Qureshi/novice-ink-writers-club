type ApiErrorShape = {
	statusCode: number;
	message: string;
};

declare global {
	type ApiError = ApiErrorShape;
}

export type ApiError = ApiErrorShape;
