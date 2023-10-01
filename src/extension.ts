'use strict'
import * as vscode from 'vscode';
import { window, workspace, Range, Position, TextEditor } from 'vscode';

import HighlightConfig from './config';
import HighlightLine from './highlightline';

export async function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "easylife" is now active!');

	new HighlightLine();

	// let highlightLineConfig = HighlightConfig.getHighlightLineConfig();
	// let decorationType = highlightLineConfig.decorators;
	// let activeEditor = window.activeTextEditor;
	// if (activeEditor === undefined) {
	// 	return
	// }
	// let lastActivePosition = new Position(activeEditor.selection.active.line, activeEditor.selection.active.character);

	// window.onDidChangeActiveTextEditor(() => {
	// 	try {
    //         activeEditor = window.activeTextEditor
    //         updateDecorations(decorationType)
	// 	} catch (e) {
	// 		console.error("Error from window.onDicChangeActiveTxEditor -->", e)
	// 	} finally {
	// 		if (activeEditor === undefined) {
	// 			return
	// 		}
	// 		lastActivePosition = new Position(activeEditor.selection.active.line, activeEditor.selection.active.character);
	// 	}
	// })

	// window.onDidChangeTextEditorSelection(() => {
	// 	activeEditor = window.activeTextEditor;
	// 	if (activeEditor == undefined) {
	// 		return
	// 	}

	// 	let word = activeEditor.document.getText(activeEditor.selection);
	// 	if (!word) {
	// 		console.log('Nothing selected');
	// 		return;
	// 	} else {
	// 		console.log(word);
	// 	}

    //     updateDecorations(decorationType);
	// })

    // function updateDecorations(decorationType: any, updateAllVisibleEditors=false) {
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
    //     } catch (error){
    //         console.error("Error from ' updateDecorations' -->", error)
    //     } finally {
	// 		if (activeEditor === undefined) return;

    //         lastActivePosition = new Position(activeEditor.selection.active.line, activeEditor.selection.active.character);
    //     }
    // }

    // workspace.onDidChangeConfiguration(() => {
    //     decorationType.dispose();

	// 	let highlightLineConfig = HighlightConfig.getHighlightLineConfig();
    //     decorationType = highlightLineConfig.decorators;
    //     updateDecorations(decorationType, true)
    // })
}

// This method is called when your extension is deactivated
export function deactivate() {}
