<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, type Report } from '#lib/kb/causes';
  import { PROBLEMS, problemsIn } from '#lib/kb/problems';
  import { ISSUES_URL, PROBLEM_TICKETS } from '#lib/kb/problem-tickets';

  let { ticket }: { ticket: number } = $props();

  const all = $derived(reports as Report[]);
  const merged = $derived(uniqueById(all).filter((r) => r.mergedInto === ticket));
  const groups = $derived(problemsIn(all, ticket, notes.oneDayMove));
  const filed = $derived(groups.reduce((n, g) => n + g.reports.length, 0));
  const count = (p: string) => groups.find((g) => g.problem === p)?.reports.length ?? 0;
  // The desk's own view (CauseTable) files one-day moves under their tenant's cause: parser.
  const deskParser = $derived(count('parser') + count('one-day'));
  const tags = (g: { taggedAs: Record<string, number> }) =>
    Object.entries(g.taggedAs)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, n]) => `${tag} ×${n}`)
      .join(' · ');
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} ·
  <strong>{groups.length}</strong>
  {groups.length === 1 ? 'problem' : 'problems'}
  <span class="dup">({all.length - merged.length} rows in the export were the same report twice)</span>
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>seen</th><th>intake tagged as</th><th>ticket</th><th>outcome</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.problem)}
      {@const t = PROBLEM_TICKETS[g.problem]}
      <tr>
        <td><code>{g.problem}</code><br /><small>{PROBLEMS[g.problem]}</small></td>
        <td><strong>{g.reports.length}</strong></td>
        <td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td class="tags">{tags(g)}</td>
        <td>{#if t}<a href="{ISSUES_URL}/{t.issue}">#{t.issue}</a>{:else}<span class="none">no ticket</span>{/if}</td>
        <td><small>{t?.state ?? ''}</small></td>
      </tr>
    {/each}
  </tbody>
  <tfoot>
    <tr><td>total</td><td><strong>{filed}</strong></td><td colspan="5" class:none={filed !== merged.length}>{filed === merged.length ? 'every report filed once' : `${merged.length - filed} reports missing`}</td></tr>
  </tfoot>
</table>

<p class="dup">Counted the desk's way (one-day moves filed under their tenant's cause), ticket #1 covers
<strong>{deskParser}</strong> reports and #2 covers <strong>{count('hint')}</strong>.</p>

<style>
  .sum { font-size: 1.1rem; }
  .dup, .tags, small { color: var(--muted); font-size: 0.85em; }
  .none { color: var(--warn); font-weight: 600; }
</style>
