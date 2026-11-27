declare const Gender: {
    readonly MALE: "male";
    readonly FEMALE: "female";
    readonly PREFER_NOT_TO_SAY: "prefer not to say";
};
type Gender = (typeof Gender)[keyof typeof Gender];
export { Gender };
