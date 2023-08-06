import { computeActivityCompletionsDiff } from '~/components/activity/activity-definition-models';

describe('compute activity completions diff', () => {
    it('should add all previous indices', () => {
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

    it('should not add any diffs when marking one complete forward', () => {
        const completions = {
            latestFinishedIndex: 4,
            exceptions: new Set<number>([2, 3]),
        };

        const { added, removed, newLatestFinishedIndex } =
            computeActivityCompletionsDiff(completions, 5, true);
        expect(added).toEqual([]);
        expect(removed).toEqual([]);
        expect(newLatestFinishedIndex).toEqual(5);
    });

    it('should remove from set when marking complete before', () => {
        const completions = {
            latestFinishedIndex: 4,
            exceptions: new Set<number>([2, 3]),
        };

        const { added, removed, newLatestFinishedIndex } =
            computeActivityCompletionsDiff(completions, 3, true);
        expect(added).toEqual([]);
        expect(removed).toEqual([3]);
        expect(newLatestFinishedIndex).toEqual(4);
    });

    it('should add exception if way before', () => {
        const completions = {
            latestFinishedIndex: 4,
            exceptions: new Set<number>([2, 3]),
        };

        const { added, removed, newLatestFinishedIndex } =
            computeActivityCompletionsDiff(completions, 1, false);
        expect(added).toEqual([1]);
        expect(removed).toEqual([]);
        expect(newLatestFinishedIndex).toEqual(4);
    });

    it('should add new exceptions when far forward', () => {
        const completions = {
            latestFinishedIndex: 4,
            exceptions: new Set<number>([2, 3]),
        };

        const { added, removed, newLatestFinishedIndex } =
            computeActivityCompletionsDiff(completions, 7, true);
        expect(added).toEqual([5, 6]);
        expect(removed).toEqual([]);
        expect(newLatestFinishedIndex).toEqual(7);
    });

    it('should close exceptions', () => {
        const completions = {
            latestFinishedIndex: 6,
            exceptions: new Set<number>([1, 2, 5]),
        };

        const { added, removed, newLatestFinishedIndex } =
            computeActivityCompletionsDiff(completions, 5, true);
        expect(added).toEqual([]);
        expect(removed).toEqual([5]);
        expect(newLatestFinishedIndex).toEqual(6);
    });

    it('should add an exception exceptions', () => {
        const completions = {
            latestFinishedIndex: 6,
            exceptions: new Set<number>([]),
        };

        const { added, removed, newLatestFinishedIndex } =
            computeActivityCompletionsDiff(completions, 5, false);
        expect(added).toEqual([5]);
        expect(removed).toEqual([]);
        expect(newLatestFinishedIndex).toEqual(6);
    });
});
