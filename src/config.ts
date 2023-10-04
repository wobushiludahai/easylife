'use strict';
import { workspace, TextEditorDecorationType, window } from "vscode"

interface highlightWordsConfig {
    colors: highlightWordsColors[],
    onlyBorder: boolean,
    showSidebar: boolean
}

export interface highlightWordsColors {
    light: string
    dark: string
}

interface highlightLineConfig {
    decorators: TextEditorDecorationType
    isHighlightLineEnabled: boolean
}

class HighlightConfig {
    static getHighlightwordsConfig(): highlightWordsConfig {
        let config = workspace.getConfiguration('highlightwords')
        let colors: highlightWordsColors[] = <highlightWordsColors[]>config.get('colors');
        const onlyBorder = <boolean>config.get('onlyBorder')
        const showSidebar = <boolean>config.get('showSidebar')

        return {colors, onlyBorder, showSidebar}
    }

    static getHighlightLineConfig():highlightLineConfig {
        const config = workspace.getConfiguration("highlightLine")
        const Color = config.get("borderColor");
        const borderWidth = config.get("borderWidth");
        const borderStyle = config.get("borderStyle");

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