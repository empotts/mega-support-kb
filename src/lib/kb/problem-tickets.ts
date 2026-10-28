// Where each problem split out of #4471 is filed: one GitHub issue per problem.
import type { Problem } from '#lib/kb/problems';

export const ISSUES_URL = 'https://github.com/empotts/mega-support-kb/issues';

export const PROBLEM_TICKETS: Partial<Record<Problem, number>> = {
  parser: 1,
  hint: 2,
  'one-day': 3,
};
