// 'use strict';
// import { window, Range, TextEditorDecorationType } from "vscode";
// import HighlightConfig from './config';

// export interface HighlighWordsTable {
//     word: string;
//     iswholeWord: boolean;
//     ignoreCase: boolean;
// }

// const qpOptions = ['ignore case', 'whole word', 'both']

// class HighlightWords {
//     private words: HighlighWordsTable[]

//     constructor() {
//         this.words = [];
//     }

//     public updateDecorations(active?:any) {
//         window.visibleTextEditors.forEach(editor => {
//             if (active && editor.document != window.activeTextEditor.document) return;
//             const text = editor.document.getText();
//             let match;
//             let decs = [];
//             this.decorators.forEach(function () {
//                 let dec = [];
//                 decs.push(dec);
//             });
//             this.words.forEach((w, n) => {
//                 const opts = w.ignoreCase ? 'gi' : 'g'
//                 const expression = w.wholeWord ? '\\b' + w.expression + '\\b' : w.expression
//                 const regEx = new RegExp(expression, opts);
//                 this.ranges[w.expression] = []
//                 while (match = regEx.exec(text)) {
//                     const startPos = editor.document.positionAt(match.index);
//                     const endPos = editor.document.positionAt(match.index + match[0].length);
//                     const decoration = { range: new Range(startPos, endPos) };
//                     decs[n % decs.length].push(decoration);
//                     this.ranges[w.expression].push(decoration.range)
//                 }
//             });
//             this.decorators.forEach(function (d, i) {
//                 editor.setDecorations(d, decs[i]);
//             });
//             this.treeProvider.words = this.words
//             this.treeProvider.refresh()

//         })

//     }

//     public addSelected(withOptions?: boolean) {
//         const activeEditor = window.activeTextEditor;
// 		if (activeEditor == undefined) {
// 			return
// 		}

// 		let word = activeEditor.document.getText(activeEditor.selection);
//         if(!word) {
//             const range = activeEditor.document.getWordRangeAtPosition(activeEditor.selection.start)
//             if(range) word = activeEditor.document.getText(range)
//         }
//         if (!word) {
//             window.showInformationMessage('Nothing selected!')
//             return;
//         }

//         const highlights = this.words.filter(w => w.word == word) // avoid duplicates
//         if (!highlights || !highlights.length) {
//             if (withOptions) {
//                 window.showQuickPick(qpOptions).then(option => {
//                     if (!option) return;

//                     this.words.push({
//                         word: word,
//                         iswholeWord : option == 'whole word' || option == 'both',
//                         ignoreCase: option == 'ignore case' || option == 'both'
//                     });
//                     this.updateDecorations()
//                 })
//             }
//             else {
//                 const ww = this.mode == Modes.WholeWord || this.mode == Modes.Both
//                 const ic = this.mode == Modes.IgnoreCase || this.mode == Modes.Both

//                 this.words.push({ expression: word, wholeWord: ww, ignoreCase: ic });
//                 this.updateDecorations()
//             }
//         } else if(highlights.length) {
//             this.words.splice(this.words.indexOf(highlights[0]),1)
//             this.updateDecorations()
//         }
//     }
// }

// export default HighlightWords