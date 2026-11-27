declare const Role: {
    readonly ADMIN: "admin";
    readonly PRESIDENT: "president";
    readonly VICE_PRESIDENT: "vice president";
    readonly SECRETARY: "secretary";
    readonly MAGAZINE_SELECTOR: "magazine selector";
    readonly MEMBER: "member";
};
type Role = (typeof Role)[keyof typeof Role];
export { Role };
