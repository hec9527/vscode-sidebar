import * as vscode from 'vscode';
import { CountryProvider } from './tree-provider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "test" is now active!');
    let provider: CountryProvider;

    provider = new CountryProvider(context);
    vscode.window.registerTreeDataProvider('showCountry', provider);

    context.subscriptions.push(
        vscode.commands.registerCommand('test.helloWorld', () => {
            vscode.window.showInformationMessage('Hello World from test!');
        })
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('test.refreshsideBar', () => {
            vscode.window.showInformationMessage('refresh sidebar');
            provider.refresh();
        })
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('test.showError', () => {
            vscode.window.showErrorMessage('出错了哦~');
        })
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('test.showTreeItem', (...args: string[]) => {
            vscode.window.showInformationMessage(`你选择了：${args.join('-')}`);
        })
    );
}

export function deactivate() {}
