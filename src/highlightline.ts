'use strict';
import { window, Range, TextEditorDecorationType, TextEditor, Position, workspace } from "vscode";
import HighlightConfig from './config';

export interface HighLightable {
    word: string;
    iswholeWord: boolean;
    ignoreCase: boolean;
}

class HighlightLine {
    private decorationType: TextEditorDecorationType
    private isHighlightEnable: boolean
    private activeEditor: TextEditor | undefined
    private lastActivePosition: Position | undefined

    constructor() {
        let highlightLineConfig = HighlightConfig.getHighlightLineConfig();

        this.decorationType = highlightLineConfig.decorators;
        this.isHighlightEnable = highlightLineConfig.isHighlightLineEnabled;
        let activeEditor = window.activeTextEditor;
        if (activeEditor) {
            this.activeEditor = activeEditor;
            this.lastActivePosition = new Position(activeEditor.selection.active.line, activeEditor.selection.active.character);
        }

        this.registerHightline();
    }

    public registerHightline() {
        // 编辑器选择
        window.onDidChangeActiveTextEditor(() => {
            if (this.isHighlightEnable === false) {
                return;
            }

            try {
                this.activeEditor = window.activeTextEditor
                this.highlightLine(this.decorationType)
            } catch (e) {
                console.error("Error from window.onDicChangeActiveTxEditor -->", e)
            } finally {
                if (this.activeEditor === undefined) {
                    return
                }
                this.lastActivePosition = new Position(this.activeEditor.selection.active.line, this.activeEditor.selection.active.character);
            }
        })

        // 文本选择
        window.onDidChangeTextEditorSelection(() => {
            let activeEditor = window.activeTextEditor;
            if (activeEditor === undefined) {
                return
            }

            this.activeEditor = activeEditor
            this.highlightLine(this.decorationType);
        })

        // 配置修改
        workspace.onDidChangeConfiguration(() => {
            this.decorationType.dispose();
            let highlightLineConfig = HighlightConfig.getHighlightLineConfig();
            this.decorationType = highlightLineConfig.decorators;
            this.isHighlightEnable = highlightLineConfig.isHighlightLineEnabled;
            this.highlightLine(this.decorationType, true)
        })
    }

    public highlightLine(decorationType: any, updateAllVisibleEditors=false) {
        const activeEditor = window.activeTextEditor;
        const lastActivePosition = this.lastActivePosition;

		try {
			if (updateAllVisibleEditors) {
				window.visibleTextEditors.forEach((editor) => {
					const currentPosition = editor.selection.active;
                    const newDecoration = { range: new Range(currentPosition, currentPosition) };
                    editor.setDecorations(decorationType, [newDecoration]);
                });
            } else {
				window.visibleTextEditors.forEach((editor) => {
					if(editor !== window.activeTextEditor || activeEditor === undefined || lastActivePosition === undefined) return;

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

            this.lastActivePosition = new Position(activeEditor.selection.active.line, activeEditor.selection.active.character);
        }
    }
}

export default HighlightLine