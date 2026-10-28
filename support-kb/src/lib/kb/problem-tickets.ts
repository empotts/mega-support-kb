// Where each problem split out of #4471 is filed: one GitHub issue per problem, and how it ended
// (engineering update, #4471 closed 05 Oct).
import type { Problem } from '#lib/kb/problems';

export const ISSUES_URL = 'https://github.com/empotts/mega-support-kb/issues';

export const PROBLEM_TICKETS: Partial<Record<Problem, { issue: number; state: string }>> = {
  parser: { issue: 1, state: 'fixed: fix(dates): parse dd/mm for eu locales' },
  hint: { issue: 2, state: "won't fix: booking-v3 form retired" },
  'one-day': { issue: 3, state: 'duplicate of #1: the desk files these under parser' },
};
