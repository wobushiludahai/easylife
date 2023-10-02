'use strict'
import * as vscode from 'vscode';
import { window, workspace, Range, Position, TextEditor, commands } from 'vscode';

import HighlightConfig from './config';
import HighlightLine from './highlightline';
import HighlightWords from './highlightwords';

function registerHighlightLine() {
	new HighlightLine();
}

function registerHighlightWords(context: vscode.ExtensionContext) {
	let highlightWord = new HighlightWords();

	commands.registerCommand('easylife.highlightwords', function () {
		highlightWord.addSelected();
	});

	window.onDidChangeVisibleTextEditors(function (editor) {
        highlightWord.updateDecorations();
    }, null, context.subscriptions);

	var timeout: NodeJS.Timer
    workspace.onDidChangeTextDocument(function (event) {
        let activeEditor = window.activeTextEditor;
        if (activeEditor && event.document === activeEditor.document) {
			if (timeout) {
				clearTimeout(timeout);
			}
			timeout = setTimeout(() => {
				highlightWord.updateActive()
			}, 500);
        }
    }, null, context.subscriptions);
}

export async function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "easylife" is now active!');
	registerHighlightLine();
	registerHighlightWords(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}
