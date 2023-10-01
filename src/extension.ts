// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
'use strict'
import * as vscode from 'vscode';
import { window, workspace, Range, Position, TextEditor } from 'vscode';

import HighlightConfig from './config';

export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "easylife" is now active!');

	let decorationType = HighlightConfig.getHighlightLineConfig().decorators;
	let activeEditor = window.activeTextEditor;
	if (activeEditor === undefined) {
		return
	}
	let lastActivePosition = new Position(activeEditor.selection.active.line, activeEditor.selection.active.character);

	window.onDidChangeActiveTextEditor(() => {
		try {
			console.log("try test")
            activeEditor = window.activeTextEditor
            updateDecorations(decorationType)
		} catch (e) {
			console.error("Error from window.onDicChangeActiveTxEditor -->", e)
		} finally {
			if (activeEditor === undefined) {
				return
			}
			console.log("final test finished")
			lastActivePosition = new Position(activeEditor.selection.active.line, activeEditor.selection.active.character);
		}
	})

	window.onDidChangeTextEditorSelection(() => {
		console.log("onDidChangeTextEditorSelection test")
		activeEditor = window.activeTextEditor;
		if (activeEditor == undefined) {
			return
		}

		let word = activeEditor.document.getText(activeEditor.selection);
		if (!word) {
			console.log('Nothing selected');
		} else {
			console.log(word);
		}

        updateDecorations(decorationType);
	})

    function updateDecorations(decorationType: any, updateAllVisibleEditors=false) {
		try {
			if (updateAllVisibleEditors) {
				window.visibleTextEditors.forEach((editor) => {
					const currentPosition = editor.selection.active;
                    const currentLine = editor.selection.active.line;
                    const newDecoration = { range: new Range(currentPosition, currentPosition) };
                    editor.setDecorations(decorationType, [newDecoration]);
                });
            }

            //edit only currently active editor
            else {
				window.visibleTextEditors.forEach((editor) => {
					if(editor !== window.activeTextEditor || activeEditor === undefined) return;

                    const currentPosition = editor.selection.active
                    const editorHasChangedLines = lastActivePosition.line !== currentPosition.line
                    const isNewEditor = activeEditor.document.lineCount === 1 && lastActivePosition.line === 0 && lastActivePosition.character == 0;
                    const newDecoration = { range: new Range(currentPosition, currentPosition) }

                    if(editorHasChangedLines || isNewEditor){
                        editor.setDecorations(decorationType, [newDecoration])
                    }
                });
            }
        }
        catch (error){
            console.error("Error from ' updateDecorations' -->", error)
        } finally {
			if (activeEditor === undefined) return;

            lastActivePosition = new Position(activeEditor.selection.active.line, activeEditor.selection.active.character);
        }
    }

    workspace.onDidChangeConfiguration(() => {
        //clear all decorations
        decorationType.dispose();
        decorationType = HighlightConfig.getHighlightLineConfig().decorators;
        updateDecorations(decorationType, true)
    })
}

// This method is called when your extension is deactivated
export function deactivate() {}
