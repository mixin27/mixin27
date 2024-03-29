import * as JsSearch from "js-search";
import { SearchContent } from "@interfaces/Markdown";
import { getLocalSearchDocuments } from "./utils";

class ContentIndexer {
  private static instance: ContentIndexer;
  // We know that this object wil be initialized,
  // so we use definite assignment assertion operator
  private searchEngine!: JsSearch.Search;

  public static get Instance(): ContentIndexer {
    return this.instance || (this.instance = new this());
  }

  constructor() {
    this.buildIndex();
  }

  private buildIndex() {
    console.log("Building search index!");
    this.searchEngine = new JsSearch.Search("slug");
    this.searchEngine.addIndex("title");
    this.searchEngine.addIndex("description");
    this.searchEngine.addDocuments(getLocalSearchDocuments());
  }

  public search(query: string): SearchContent[] {
    const results = this.searchEngine.search(query);
    return results as SearchContent[];
  }
}

export default ContentIndexer.Instance;
