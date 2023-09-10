// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { window, workspace } from 'vscode';

//UTILITIES
function getDecorationTypeFromConfig() {
    const config = workspace.getConfiguration("highlightLine")
    const borderColor = config.get("borderColor");
    const borderWidth = config.get("borderWidth");
    const borderStyle = config.get("borderStyle");

	console.log(borderColor)
	console.log(borderWidth)
	console.log(borderStyle)
    // const decorationType = window.createTextEditorDecorationType({
    //     isWholeLine: true,
    //     borderWidth: `0 0 ${borderWidth} 0`,
    //     borderStyle: `${borderStyle}`, //TODO: file bug, this shouldn't throw a lint error.
    //     borderColor
    // })
    // return decorationType;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "easylife" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('easylife.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		console.log('Easy life testing')
		getDecorationTypeFromConfig()
		vscode.window.showInformationMessage('Hello World from EasyLife!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
