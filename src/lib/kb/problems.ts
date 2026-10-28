// The problems inside one merged ticket. causes.ts says which bug a month flip belongs to. A report
// the desk read as a one-day move (desk-notes.json) is no month flip at all: its own problem.
import { causeOf, uniqueById, type Cause, type Report } from '#lib/kb/causes';
import { tenantOf } from '#lib/kb/locales';

export type Problem = Cause | 'one-day' | 'unplaced';

export const PROBLEMS: Record<Problem, string> = {
  parser: 'The shared parser reads a day-first date month first: day and month swap.',
  hint: 'booking-v3 prints MM/DD/YYYY under the date field; day-first tenants type what it says, the form reads it day first.',
  'one-day': 'The date moves by one day, not a month: a time-zone shift, not the parser.',
  unplaced: 'No tenant on file, or a month-first tenant: no cause yet.',
};

export function problemOf(r: Report, oneDayMove: readonly string[]): Problem {
  if (oneDayMove.includes(r.id)) return 'one-day';
  return causeOf(r, tenantOf(r)) ?? 'unplaced';
}

export type ProblemGroup = {
  problem: Problem;
  reports: Report[];
  tenants: number;
  firstSeen: string;
  lastSeen: string;
  // What intake tagged these reports as: tag → count.
  taggedAs: Record<string, number>;
};

// One id, one report; only the reports merged into `ticket`; largest problem first.
export function problemsIn(reports: Report[], ticket: number, oneDayMove: readonly string[]): ProblemGroup[] {
  const by = new Map<Problem, Report[]>();
  for (const r of uniqueById(reports).filter((r) => r.mergedInto === ticket)) {
    const p = problemOf(r, oneDayMove);
    by.set(p, [...(by.get(p) ?? []), r]);
  }
  return [...by.entries()]
    .map(([problem, rs]) => {
      const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
      return {
        problem,
        reports: rs,
        tenants: new Set(rs.map((r) => r.tenant)).size,
        firstSeen: days[0],
        lastSeen: days[days.length - 1],
        taggedAs: rs.reduce<Record<string, number>>((n, r) => ({ ...n, [r.meta.intakeTag]: (n[r.meta.intakeTag] ?? 0) + 1 }), {}),
      };
    })
    .sort((a, b) => b.reports.length - a.reports.length);
}
