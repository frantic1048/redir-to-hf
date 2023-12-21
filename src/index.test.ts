import { describe, test } from 'vitest'
import { convertPath } from './index'

interface TestCase {
	input: string
	expected: string
	todo?: boolean
	title?: string
}
const cases: TestCase[] = [
	{
		input: '/facebook--opt-125m-27dcfa7/README.md',
		expected: '/facebook/opt-125m/resolve/27dcfa7/README.md',
	},
	{
		title: 'double dash `--` before hash',
		input: '/facebook--opt-125m--27dcfa7/README.md',
		expected: '/facebook/opt-125m/resolve/27dcfa7/README.md',
	},
	{
		title: 'strip special `models--` prefix',
		input: '/models--facebook--opt-125m-27dcfa7/README.md',
		expected: '/facebook/opt-125m/resolve/27dcfa7/README.md',
	},
	{
		title: 'preserve `datasets--` prefix as a parent path',
		input: '/datasets--facebook--opt-125m-27dcfa7/README.md',
		expected: '/datasets/facebook/opt-125m/resolve/27dcfa7/README.md',
	},
]

describe.concurrent('convertPath()', () => {
	for (const { todo, title, input, expected } of cases) {
		;(todo ? test.todo : test)(
			title ?? `${input} => ${expected}`,
			({ expect }) => {
				expect(convertPath(input)).toBe(expected)
			},
		)
	}
})
