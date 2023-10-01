'use strict';
import { workspace, TextEditorDecorationType, window } from "vscode"

interface ConfigValues {
    decorators: TextEditorDecorationType[]
    defaultMode?: number,
    showSidebar?: boolean
}

interface highlightLineConfig {
    decorators: TextEditorDecorationType
    isHighlightLineEnabled: boolean
}

class HighlightConfig {
    static getConfigValues(): TextEditorDecorationType {
        const config = workspace.getConfiguration("highlightLine")
        const Color = config.get("borderColor");
        const borderWidth = config.get("borderWidth");
        const borderStyle = config.get("borderStyle");

        console.log(Color)
        console.log(borderWidth)
        console.log(borderStyle)
        const decorationType = window.createTextEditorDecorationType({
            isWholeLine: true,
            borderWidth: `0 0 ${borderWidth} 0`,
            borderStyle: `${borderStyle}`,
            borderColor: `${Color}`
        })

        return decorationType;
    }

    static getHighlightLineConfig():highlightLineConfig {
        const config = workspace.getConfiguration("highlightLine")
        const Color = config.get("borderColor");
        const borderWidth = config.get("borderWidth");
        const borderStyle = config.get("borderStyle");

        console.log(Color)
        console.log(borderWidth)
        console.log(borderStyle)
        const decorationType = window.createTextEditorDecorationType({
            isWholeLine: true,
            borderWidth: `0 0 ${borderWidth} 0`,
            borderStyle: `${borderStyle}`,
            borderColor: `${Color}`
        })

        return {decorators: decorationType, isHighlightLineEnabled: true}
    }
}

export default HighlightConfig