'use strict'
import * as vscode from 'vscode';
import { window, workspace, Range, Position, TextEditor } from 'vscode';

import HighlightConfig from './config';
import HighlightLine from './highlightline';

function registerHighlightLine() {
	new HighlightLine();
}

export async function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "easylife" is now active!');
	registerHighlightLine();
}

// This method is called when your extension is deactivated
export function deactivate() {}
