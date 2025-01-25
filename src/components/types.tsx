export interface SearchResult {
    answer: string
    source: string
}

export interface SearchResultsData {
    [key: number]: SearchResult
    length: number
}