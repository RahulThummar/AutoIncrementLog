const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
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

      // Optionally update the clipboard, if needed.
      await vscode.env.clipboard.writeText(modifiedContent);

      editor.edit(editBuilder => {
        // If there's a selection, replace it; otherwise, insert at the cursor.
        if (editor.selection.isEmpty) {
          editBuilder.insert(editor.selection.active, modifiedContent);
        } else {
          editBuilder.replace(editor.selection, modifiedContent);
        }
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
};
