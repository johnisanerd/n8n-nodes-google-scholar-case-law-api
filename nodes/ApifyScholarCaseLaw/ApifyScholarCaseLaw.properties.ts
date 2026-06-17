import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';

/** Split a comma or newline separated string into a clean list of values. */
function toList(value: string): string[] {
	return value
		.split(/[\n,]/)
		.map((v) => v.trim())
		.filter((v) => v.length > 0);
}

/**
 * Build the Apify Actor input from node parameters.
 * Only the real Actor inputs are sent; the Output / Fields parameters shape the
 * data we return, they are not part of the Actor input.
 */
export function buildActorInput(
	context: IExecuteFunctions,
	itemIndex: number,
	defaultInput: Record<string, any>,
): Record<string, any> {
	const input: Record<string, any> = {
		...defaultInput,
		maxResults: context.getNodeParameter('maxResults', itemIndex, 20),
		language: context.getNodeParameter('language', itemIndex, 'en'),
		sortByDate: context.getNodeParameter('sortByDate', itemIndex, false),
		excludeCitations: context.getNodeParameter('excludeCitations', itemIndex, false),
		fetchCaseDetailsForResults: context.getNodeParameter(
			'fetchCaseDetailsForResults',
			itemIndex,
			false,
		),
	};

	const query = context.getNodeParameter('query', itemIndex, '') as string;
	if (query) input.query = query;

	const caseIds = context.getNodeParameter('caseIds', itemIndex, '') as string;
	if (caseIds) input.caseIds = toList(caseIds);

	const courts = context.getNodeParameter('courts', itemIndex, '') as string;
	if (courts) input.courts = toList(courts);

	const yearFrom = context.getNodeParameter('yearFrom', itemIndex, 0) as number;
	if (yearFrom) input.yearFrom = yearFrom;

	const yearTo = context.getNodeParameter('yearTo', itemIndex, 0) as number;
	if (yearTo) input.yearTo = yearTo;

	return input;
}

const resourceProperties: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Case',
				value: 'case',
			},
		],
		default: 'case',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['case'],
			},
		},
		options: [
			{
				name: 'Search',
				value: 'search',
				action: 'Search case law',
				description: 'Search case law and return one item per result',
			},
		],
		default: 'search',
	},
];

const actorProperties: INodeProperties[] = [
	{
		displayName: 'Search Query',
		name: 'query',
		type: 'string',
		default: '',
		placeholder: 'e.g. patent infringement',
		description:
			'Case-law search query. Provide a Search Query, Case IDs, or both. Supports operators like author: and source:.',
		displayOptions: { show: { resource: ['case'], operation: ['search'] } },
	},
	{
		displayName: 'Case IDs',
		name: 'caseIds',
		type: 'string',
		default: '',
		placeholder: 'e.g. 1234567890,9876543210',
		description:
			'Comma-separated Google Scholar case IDs to pull full case detail for. Use when you already know the cases.',
		displayOptions: { show: { resource: ['case'], operation: ['search'] } },
	},
	{
		displayName: 'Max Results',
		name: 'maxResults',
		type: 'number',
		default: 20,
		typeOptions: { minValue: 1, maxValue: 100 },
		description: 'Maximum number of search results to return (max 100)',
		displayOptions: { show: { resource: ['case'], operation: ['search'] } },
	},
	{
		displayName: 'Court Codes',
		name: 'courts',
		type: 'string',
		default: '',
		placeholder: 'e.g. 158,159',
		description:
			'Comma-separated Google Scholar court codes to limit jurisdictions (e.g. 158 = Supreme Court). Leave empty for all US courts.',
		displayOptions: { show: { resource: ['case'], operation: ['search'] } },
	},
	{
		displayName: 'Year From',
		name: 'yearFrom',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0, maxValue: 2100 },
		description: 'Earliest decision year to include (inclusive). Use 0 for no lower bound.',
		displayOptions: { show: { resource: ['case'], operation: ['search'] } },
	},
	{
		displayName: 'Year To',
		name: 'yearTo',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0, maxValue: 2100 },
		description: 'Latest decision year to include (inclusive). Use 0 for no upper bound.',
		displayOptions: { show: { resource: ['case'], operation: ['search'] } },
	},
	{
		displayName: 'Language Code',
		name: 'language',
		type: 'string',
		default: 'en',
		placeholder: 'e.g. en',
		description: 'Two-letter language code for the search interface',
		displayOptions: { show: { resource: ['case'], operation: ['search'] } },
	},
	{
		displayName: 'Sort by Date',
		name: 'sortByDate',
		type: 'boolean',
		default: false,
		description: 'Whether to sort results by decision date (newest first) instead of relevance',
		displayOptions: { show: { resource: ['case'], operation: ['search'] } },
	},
	{
		displayName: 'Exclude Citations',
		name: 'excludeCitations',
		type: 'boolean',
		default: false,
		description: 'Whether to exclude bare citation entries and return only full opinions',
		displayOptions: { show: { resource: ['case'], operation: ['search'] } },
	},
	{
		displayName: 'Fetch Details for Search Results',
		name: 'fetchCaseDetailsForResults',
		type: 'boolean',
		default: false,
		description:
			'Whether to fetch full case detail for every search result (one detail charge per result)',
		displayOptions: { show: { resource: ['case'], operation: ['search'] } },
	},
];

const outputProperties: INodeProperties[] = [
	{
		displayName: 'Output',
		name: 'output',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['case'], operation: ['search'] } },
		options: [
			{
				name: 'Raw',
				value: 'raw',
				description: 'Return every field the API produces for each result',
			},
			{
				name: 'Selected Fields',
				value: 'selected',
				description: 'Choose exactly which fields to return',
			},
			{
				name: 'Simplified',
				value: 'simplified',
				description: 'Return a compact set of the most useful case fields',
			},
		],
		default: 'simplified',
		description: 'How much data to return for each result',
	},
	{
		displayName: 'Fields to Include',
		name: 'fields',
		type: 'multiOptions',
		displayOptions: {
			show: { resource: ['case'], operation: ['search'], output: ['selected'] },
		},
		options: [
			{ name: 'Case ID', value: 'case_id' },
			{ name: 'Case Name', value: 'name' },
			{ name: 'Case Numbers', value: 'case_numbers' },
			{ name: 'Cited Cases', value: 'cited_cases' },
			{ name: 'Court Name', value: 'court_name' },
			{ name: 'Dates', value: 'dates' },
			{ name: 'Fetched At', value: 'fetched_at' },
			{ name: 'Link', value: 'link' },
			{ name: 'Position', value: 'position' },
			{ name: 'Publication Info', value: 'publication_info' },
			{ name: 'Result ID', value: 'result_id' },
			{ name: 'Result Type', value: 'result_type' },
			{ name: 'Short Citations', value: 'short_citations' },
			{ name: 'Snippet', value: 'snippet' },
			{ name: 'Title', value: 'title' },
		],
		default: ['title', 'name', 'court_name', 'snippet', 'link'],
		description: 'Which fields to return when Output is set to Selected Fields',
	},
];

const authenticationProperties: INodeProperties[] = [
	{
		displayName: 'Authentication',
		name: 'authentication',
		type: 'options',
		options: [
			{
				name: 'API Key',
				value: 'apifyApi',
			},
			{
				name: 'OAuth2',
				value: 'apifyOAuth2Api',
			},
		],
		default: 'apifyApi',
		description: 'Choose which authentication method to use',
	},
];

export const properties: INodeProperties[] = [
	...resourceProperties,
	...actorProperties,
	...outputProperties,
	...authenticationProperties,
];
