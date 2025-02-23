// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activateds
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "autoincrementlog.AutoIncrementLog",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const clipboardContent = await vscode.env.clipboard.readText();
      const regex = /console\.log\("object (\d+)"\)/;

      let modifiedContent = clipboardContent.replace(regex, (_, num) => {
        return `console.log("object ${parseInt(num, 10) + 1}")`;
      });
      await vscode.env.clipboard.writeText(modifiedContent);

      editor.edit((editBuilder) => {
        editBuilder.insert(editor.selection.active, modifiedContent);
      });
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
