"use strict";
import { window, Range, TextEditorDecorationType, ThemableDecorationRenderOptions, OverviewRulerLane, TreeItem } from "vscode";
import HighlightConfig from "./config";
import HighlightTreeProvider from "./wordstree"

// 默认全词
export interface HighlighWordsTable {
    word: string;
    ignoreCase: boolean;
    decoration: TextEditorDecorationType;
}

interface highlightWordsColors {
    light: string
    dark: string
}

class HighlightWords {
    private words: HighlighWordsTable[];
    private colors: highlightWordsColors[];
    private onlyBorder: boolean = false;
    private treeProvider: HighlightTreeProvider;
    private ranges: any;

    constructor() {
        this.words = [];
        this.ranges = [];

        let highlightWordsConfig = HighlightConfig.getHighlightwordsConfig();
        this.colors = highlightWordsConfig.colors;
        this.onlyBorder = highlightWordsConfig.onlyBorder;

        this.treeProvider = new HighlightTreeProvider(this.getWords());
        window.registerTreeDataProvider('highlightWordsSidebar', this.treeProvider);
    }

    public setDecorators(c: highlightWordsColors[]) { this.colors = c }
    public setOnlyBorder(b: boolean) { this.onlyBorder = b }
    public getWords() { return this.words }

    private updateSidebar() {
        this.treeProvider.refresh(this.words)
    }

    public updateSidebarIndex(word: string, range: Range) {
        this.treeProvider.setCurrentWord(word);
        this.treeProvider.setCurrentIndex(0, 0);

        Object.keys(this.ranges[word]).some((r, i) => {
            const thisrange: Range = this.ranges[word][i]
            if (thisrange.start.character == range.start.character && thisrange.start.line == range.start.line) {
                this.treeProvider.setCurrentIndex(i + 1, this.ranges[word].length);
                return true
            }
        })

        this.updateSidebar();
    }

    public clearSidebarIndex() {
        this.treeProvider.setCurrentWord('');
        this.treeProvider.setCurrentIndex(0, 0);
        this.updateSidebar();
    }

    private createNewDecorator(index?: number): TextEditorDecorationType {
        let randNumber = Math.floor(Math.random() * this.colors.length);
        let color = this.colors[randNumber];

        var dark: ThemableDecorationRenderOptions = {
            overviewRulerColor: color.dark,
            backgroundColor: this.onlyBorder ? 'inherit' : color.dark,
            borderColor: color.dark
        }
        if (!this.onlyBorder)
            dark.color = '#555555'
        let decorationType = window.createTextEditorDecorationType({
            borderWidth: '2px',
            borderStyle: 'solid',
            overviewRulerLane: OverviewRulerLane.Right,
            light: {
                overviewRulerColor: color.light,
                borderColor: color.light,
                backgroundColor: this.onlyBorder ? 'inherit' : color.light
            },
            dark: dark
        });

        return decorationType
    }

    public updateDecorations(active?: any) {
        window.visibleTextEditors.forEach(editor => {
            const activeEditor = window.activeTextEditor

            if (active && activeEditor && editor.document != activeEditor.document) return;
            const text = editor.document.getText();
            let match;
            this.words.forEach((w, n) => {
                let decsRange: any = [];
                const opts = w.ignoreCase ? 'gi' : 'g'
                const regEx = new RegExp(w.word, opts);

                if (editor == activeEditor) {
                    this.ranges[w.word] = []
                }
                while (match = regEx.exec(text)) {
                    const startPos = editor.document.positionAt(match.index);
                    const endPos = editor.document.positionAt(match.index + match[0].length);
                    const decoration = { range: new Range(startPos, endPos) };
                    decsRange.push(decoration);
                    if (editor == activeEditor) {
                        this.ranges[w.word].push(decoration.range)
                    }
                }

                editor.setDecorations(w.decoration, decsRange);
            });

            this.updateSidebar();
        })
    }

    public updateActive() {
        this.updateDecorations(true)
    }

    public removeAllDecorations() {
        this.words.forEach((w, n) => {
            this.ranges[w.word] = []
            this.words[n].decoration.dispose();
            this.words.splice(n, 1)  // remove
        });

        this.updateSidebar();
    }

    public removeSelected(word: string) {
        if (!word) return;

        const highlights = this.words.filter(w => w.word == word)
        if (!highlights || !highlights.length) {    // 未添加
            window.showInformationMessage("None added!");
        } else if (highlights.length) {  // 已添加
            let index = this.words.indexOf(highlights[0]);

            this.ranges[this.words[index].word] = []
            this.words[index].decoration.dispose();
            this.words.splice(index, 1);    //remove words

            this.updateSidebar();
        }
    }

    public addSelected() {
        const activeEditor = window.activeTextEditor;
        if (activeEditor == undefined) {
            return;
        }

        let word = activeEditor.document.getText(activeEditor.selection);
        if (!word) {
            // 光标置于某个单词上的场景
            const range = activeEditor.document.getWordRangeAtPosition(
                activeEditor.selection.start
            );
            if (range) word = activeEditor.document.getText(range);
        }

        if (!word) {
            window.showInformationMessage("Nothing selected!");
            return;
        }

        word = word.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1") // raw selected text, not regexp
        const highlights = this.words.filter(w => w.word == word)
        if (!highlights || !highlights.length) {    // 未添加
            this.words.push({ word: word, ignoreCase: false, decoration: this.createNewDecorator() });
            this.updateDecorations()
        } else if (highlights.length) {  // 已添加
            let index = this.words.indexOf(highlights[0]);
            this.words[index].decoration.dispose();
            this.words.splice(index, 1);    //remove words

            this.updateSidebar();
        }
    }
}

export default HighlightWords;
