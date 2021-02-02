import { SearchRequest } from "./SearchRequest";

export class PaginatedSearchRequest {
    private query: SearchRequest;
    private page: number;
    private count: number;

    public constructor(query: SearchRequest, page: number, count: number) {
      this.query = query;
      this.page = page;
      this.count = count;
    }

    public getQuery(): SearchRequest {
      return this.query;
    }

    public setQuery(query: SearchRequest) {
      this.query = query;
    }

    public getPage(): number {
      return this.page;
    }

    public setPage(page: number) {
      this.page = page;
    }

    public getCount(): number {
      return this.count;
    }

    public setCount(count: number) {
      this.count = count;
    }
}
