'use strict';
import { window, Range } from "vscode";
import HighlightConfig from './config';

export interface HighLightable {
    word: string;
    iswholeWord: boolean;
    ignoreCase: boolean;
}

class Highlight {
    private words: HighLightable[]
    private isHighlightEnable: boolean

    constructor() {
        this.words = [];
        this.isHighlightEnable = HighlightConfig.getHighlightLineConfig().isHighlightLineEnabled;
    }

    public addSelected() {
        const activeEditor = window.activeTextEditor;
		if (activeEditor == undefined) {
			return
		}

		let word = activeEditor.document.getText(activeEditor.selection);
		if (!word) {
			console.log('Nothing selected');
		} else {
			console.log(word);
		}
    }

    // public highlightLine(decorationType: any, updateAllVisibleEditors=false) {
    //     const activeEditor = window.activeTextEditor;
	// 	if (activeEditor == undefined) {
	// 		return
	// 	}

	// 	try {
	// 		if (updateAllVisibleEditors) {
	// 			window.visibleTextEditors.forEach((editor) => {
	// 				const currentPosition = editor.selection.active;
    //                 const currentLine = editor.selection.active.line;
    //                 const newDecoration = { range: new Range(currentPosition, currentPosition) };
    //                 editor.setDecorations(decorationType, [newDecoration]);
    //             });
    //         } else {
	// 			window.visibleTextEditors.forEach((editor) => {
	// 				if(editor !== window.activeTextEditor || activeEditor === undefined) return;

    //                 const currentPosition = editor.selection.active
    //                 const editorHasChangedLines = lastActivePosition.line !== currentPosition.line
    //                 const isNewEditor = activeEditor.document.lineCount === 1 && lastActivePosition.line === 0 && lastActivePosition.character == 0;
    //                 const newDecoration = { range: new Range(currentPosition, currentPosition) }

    //                 if(editorHasChangedLines || isNewEditor){
    //                     editor.setDecorations(decorationType, [newDecoration])
    //                 }
    //             });
    //         }
    //     }
    //     catch (error){
    //         console.error("Error from ' updateDecorations' -->", error)
    //     } finally {
	// 		if (activeEditor === undefined) return;

    //         lastActivePosition = new Position(activeEditor.selection.active.line, activeEditor.selection.active.character);
    //     }
    // }
}

export default Highlight