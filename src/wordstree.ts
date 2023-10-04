'use strict';
import  { HighlighWordsTable } from './highlightwords'
import { TreeDataProvider, TreeItem, Event, EventEmitter, Command } from 'vscode'

interface SearchLocation {
    index: number
    count: number
}

class HighlightTreeProvider implements TreeDataProvider<HighlightNode> {
    // public currentExpression: string
    // public currentIndex: SearchLocation
	private _onDidChangeTreeData: EventEmitter<any> = new EventEmitter<any>();
    readonly onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event;

    constructor(public words: HighlighWordsTable[]) {}

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

    // private getOpts(): string {
    //     return "wholeWord"
    // }

	// get tooltip(): string {
	// 	return `${this.label}-${this.getOpts()}`;
	// }

	// get description(): string {
	// 	return this.getOpts()
	// }

	contextValue = 'highlights';

}

export default HighlightTreeProvider