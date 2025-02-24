const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const disposable = vscode.commands.registerCommand(
    'autoincrementlog.AutoIncrementLog',
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      // Read the clipboard content
      const clipboardContent = await vscode.env.clipboard.readText();

      // Regular expression to match console.log statements with a number at the end
      const regex = /console\.log\((["'`].*?)(\d+)(["'`])\);?$/;

      // Function to increment the number at the end of the matched content
      const incrementLog = (match, p1, p2, p3) => {
        // Increment the number
        const number = parseInt(p2, 10) + 1;
        // Return the updated console.log statement
        return `console.log(${p1}${number}${p3});`;
      };

      // Replace the matched content with the incremented content
      const modifiedContent = clipboardContent.replace(regex, incrementLog);

      // Optionally update the clipboard with the modified content
      await vscode.env.clipboard.writeText(modifiedContent);

      // Insert or replace the content in the editor
      editor.edit((editBuilder) => {
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
  deactivate,
};
