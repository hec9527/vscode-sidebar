import * as vscode from 'vscode';
import * as path from 'path';
import { CountryProvider } from './tree-provider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "test" is now active!');

    if (vscode.workspace.workspaceFolders) {
        vscode.window.registerTreeDataProvider(
            'showCountry',
            new CountryProvider(path.join(__dirname, '../', '/src/data/省市县镇.json'))
        );
    }

    let disposable = vscode.commands.registerCommand('test.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from test!');
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
