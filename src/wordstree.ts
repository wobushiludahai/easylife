'use strict';
import { HighlighWordsTable } from './highlightwords'
import { TreeDataProvider, TreeItem, Event, EventEmitter, Command } from 'vscode'

interface Location {
    index: number
    count: number
}

class HighlightTreeProvider implements TreeDataProvider<HighlightNode> {
    private currentWord: string = ''
    private currentIndex: Location = { index: 0, count: 0 }
    private _onDidChangeTreeData: EventEmitter<any> = new EventEmitter<any>();
    readonly onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event;

    constructor(public words: HighlighWordsTable[]) { }

    getTreeItem(element: HighlightNode): TreeItem {
        return element;
    }

    getChildren(element?: HighlightNode): Thenable<HighlightNode[]> {
        let nodes: HighlightNode[] = this.words.map(w => {
            return new HighlightNode(w.word, w, this)
        })
        return Promise.resolve(nodes)
    }

    public refresh(words: HighlighWordsTable[]): any {
        this.words = words;
        this._onDidChangeTreeData.fire(null);
    }

    public setCurrentWord(word: string): void {
        this.currentWord = word;
    }

    public getCurrentWord(): string {
        return this.currentWord;
    }

    public setCurrentIndex(index: number, count: number): void {
        this.currentIndex = {index:index, count:count};
    }

    public getCurrentIndex(): Location {
        return this.currentIndex;
    }
}

export class HighlightNode extends TreeItem {
    constructor(
        public readonly label: string,
        public readonly highlight: HighlighWordsTable,
        public provider: HighlightTreeProvider,
        public readonly command?: Command

    ) {
        super(label);
    }

    private getOpts(): string {
        const index = this.highlight.word == this.provider.getCurrentWord() ?
        ` ${this.provider.getCurrentIndex().index}/${this.provider.getCurrentIndex().count}` : ''

        return index
    }

    // @ts-ignore
    get description():string {
    	return this.getOpts()
    }

    // @ts-ignore
	get tooltip(): string {
		return ''
	}

    contextValue = 'highlights';
}

export default HighlightTreeProvider