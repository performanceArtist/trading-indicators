import { nonEmptyArray, option } from 'fp-ts';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { Option } from 'fp-ts/lib/Option';
export declare const splitAtFixed: (period: number) => <A>(arr: A[]) => option.Option<[nonEmptyArray.NonEmptyArray<A>, A[]]>;
