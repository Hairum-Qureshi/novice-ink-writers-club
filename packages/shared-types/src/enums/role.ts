const Role = {
  ADMIN: 'admin',
  PRESIDENT: 'president',
  VICE_PRESIDENT: 'vice president',
  SECRETARY: 'secretary',
  MAGAZINE_SELECTOR: 'magazine selector',
  MEMBER: 'member',
} as const;

type Role = (typeof Role)[keyof typeof Role];

export { Role };