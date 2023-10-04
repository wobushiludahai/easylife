"use strict";
import { window, Range, TextEditorDecorationType, ThemableDecorationRenderOptions, OverviewRulerLane, TreeItem } from "vscode";
import HighlightConfig from "./config";

// 默认全词
interface HighlighWordsTable {
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

    constructor() {
        this.words = [];

        let highlightWordsConfig = HighlightConfig.getHighlightwordsConfig();
        this.colors = highlightWordsConfig.colors;
        this.onlyBorder = highlightWordsConfig.onlyBorder;
    }

    public setDecorators(c: highlightWordsColors[]) { this.colors = c }
    public setOnlyBorder(b: boolean) { this.onlyBorder = b }

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
            if (active && window.activeTextEditor && editor.document != window.activeTextEditor.document) return;
            const text = editor.document.getText();
            let match;
            this.words.forEach((w, n) => {
                let decsRange: any = [];
                const opts = w.ignoreCase ? 'gi' : 'g'
                const regEx = new RegExp(w.word, opts);
                while (match = regEx.exec(text)) {
                    const startPos = editor.document.positionAt(match.index);
                    const endPos = editor.document.positionAt(match.index + match[0].length);
                    const decoration = { range: new Range(startPos, endPos) };
                    decsRange.push(decoration);
                }

                editor.setDecorations(w.decoration, decsRange);
            });
        })
    }

    public updateActive() {
        this.updateDecorations(true)
    }

    public removeAllDecorations() {
        this.words.forEach((w, n) => {
            this.words[n].decoration.dispose();
            this.words.splice(n, 1)  // remove
        });
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
            this.words.splice(index, 1)  // remove
        }
    }
}

export default HighlightWords;
