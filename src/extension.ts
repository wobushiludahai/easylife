'use strict'
import * as vscode from 'vscode';
import { window, workspace, Range, Position, Selection, commands } from 'vscode';

import HighlightConfig from './config';
import HighlightLine from './highlightline';
import HighlightWords from './highlightwords';

function registerHighlightLine() {
	new HighlightLine();
}

function registerHighlightWords(context: vscode.ExtensionContext) {
	let highlightWord = new HighlightWords();

	commands.registerCommand('easylife.highlightWordsAdd', function () {
		highlightWord.addSelected();
	});

	commands.registerCommand('easylife.highlightWordsRemove', e => {
		highlightWord.removeSelected(e.label)
	})

	window.onDidChangeActiveTextEditor(() => {
		highlightWord.clearSidebarIndex();
		highlightWord.updateDecorations(window.activeTextEditor);
	})

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

	function next(e: any, wrap?: boolean) {
		const ed = window.activeTextEditor;
		if (!ed) return;
		const doc = ed.document
		const offset = wrap ? 0 : doc.offsetAt(ed.selection.active)
		const nextStart = wrap ? 0 : 1
		const text = doc.getText()
		const slice = text.slice(offset + nextStart)
		const opts = e.highlight.ignoreCase ? 'i' : ''

		const re = new RegExp(e.highlight.word, opts)
		const pos = slice.search(re)
		if (pos == -1) {
			if (!wrap) {
				next(e, true)
			} else {
				highlightWord.updateSidebarIndex(e.highlight.word, new Range(new Position(1, 1), new Position(1, 1)))
			}
			return
		}
		const word = slice.match(re)
		if (!word) return;
		const start = doc.positionAt(pos + offset + nextStart)
		const end = new Position(start.line, start.character + word[0].length)
		const range = new Range(start, end)
		ed.revealRange(range)
		ed.selection = new Selection(start, start)
		highlightWord.updateSidebarIndex(e.highlight.word, range)
	}

	commands.registerCommand('easylife.highlightWordsfindNext', e => {
		next(e)
	});

	function prev(e: any, wrap?: boolean) {
		const ed = window.activeTextEditor;
		if (!ed) return;
		const doc = ed.document
		const iAmHere = ed.selection.active
		const offset = doc.offsetAt(iAmHere)
		const text = doc.getText()
		const slice = text.slice(0, offset)
		const opts = e.highlight.ignoreCase ? 'gi' : 'g'

		const re = new RegExp(e.highlight.word, opts)
		const pos = slice.search(re)
		if (pos == -1) {
			if (!wrap) {
				if (offset != 0) {
					const home = doc.positionAt(text.length - 1)
					ed.selection = new Selection(home, home)
					prev(e, true)
					return
				}
			} else {
				highlightWord.updateSidebarIndex(e.highlight.word, new Range(new Position(1, 1), new Position(1, 1)))
			}
		}
		let word
		let found
		let index

		while ((found = re.exec(slice)) !== null) {
			index = re.lastIndex
			word = found[0]
			console.log('last index', index)
		}

		if (!index || !word) return;
		const start = doc.positionAt(index - word.length)
		const range = new Range(start, start)
		ed.revealRange(range)
		ed.selection = new Selection(start, start)
		highlightWord.updateSidebarIndex(e.highlight.word, range)
	}

	commands.registerCommand('easylife.highlightWordsfindPrevious', e => {
		prev(e)
	});

	// 侧边栏
	let configValues = HighlightConfig.getHighlightwordsConfig()
	commands.executeCommand('setContext', 'showSidebar', configValues.showSidebar)
}

export async function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "easylife" is now active!');
	registerHighlightLine();
	registerHighlightWords(context);
}

// This method is called when your extension is deactivated
export function deactivate() { }
