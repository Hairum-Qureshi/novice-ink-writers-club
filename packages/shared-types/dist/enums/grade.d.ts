declare const Grade: {
    readonly FRESHMAN: "freshman";
    readonly SOPHOMORE: "sophomore";
    readonly JUNIOR: "junior";
    readonly SENIOR: "senior";
    readonly PREFER_NOT_TO_SAY: "prefer not to say";
};
type Grade = (typeof Grade)[keyof typeof Grade];
export { Grade };
