import { computeActivityCompletionsDiff } from '~/components/activity/activity-definition-models';

describe('compute activity completions diff', () => {
    it('should return empty diff when no completions', () => {
        const completions = {
            latestFinishedIndex: -1,
            exceptions: new Set<number>(),
        };

        const { added, removed, newLatestFinishedIndex } =
            computeActivityCompletionsDiff(completions, 3, true);
        expect(added).toEqual([0, 1, 2]);
        expect(removed).toEqual([]);
        expect(newLatestFinishedIndex).toEqual(3);
    });
});
