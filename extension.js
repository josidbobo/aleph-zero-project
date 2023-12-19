// The module 'vscode' contains the VS Code extensibility API

const path = require('path');

// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const axios = require('axios');
const fs = require('fs');

// @ts-ignore
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
// @ts-ignore
async function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extensi
	console.log('inkly is now active!');
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let dcoll = vscode.languages.createDiagnosticCollection('inklyy');

	let build = vscode.commands.registerCommand('inkly.build', function () {
		//const clipboardy = require('clipboardy');

	})
	// @ts-ignore
	let disposable = vscode.commands.registerCommand('inkly.convert', function () {
		// The code you place here will be executed every time your command is executed
		//vscode.commands.executeCommand('inkly.copyText');
 
		//const copyHandler = import("clipboardy");
		// @ts-ignore
		const env = require("dotenv").config();

		const doc = vscode.window.activeTextEditor;
		
		const fileName = doc.document.fileName;
		
		if (!doc) {
			vscode.window.showInformationMessage('No open solidity file, please open a file to begin');
			return;
		}else if(!fileName.toLowerCase().includes('.sol')){
			vscode.window.showErrorMessage('The active window is not a solidity file, please select a Solidity file to begin');
			return;
		}
		// @ts-ignore
		//console.log(`Taxi for Email: sending ${doc.document.lineCount} lines for validation`);
		// @ts-ignore
		const splitted = fileName.split('\\');
		let contract_name = 'contract';
		splitted.map(function (e, i, array){
			const p = e.includes('.sol');
			if(p === true){
				array[i].split('.').map(function(y, r, t){
					console.log(t);
					contract_name = t[0];
				})
			}
		})

		// @ts-ignore
		const docStream = doc.document.getText();

		/**
		 * @type {any}
		 */
		 vscode.window.withProgress({
			cancellable: false,
			location: vscode.ProgressLocation.Notification,
			title: 'inkly',
		}, async (progress) => {
			progress.report({message: 'Converting to !ink'});
			try{
			const response = await axios.post(process.env.url, {
				"prompt": process.env.prompt,
				"max_tokens": process.env.tokens,
				"model": process.env.model,
				"seed" : 1
			},{
				headers: {
					'Content-Type' : 'application/json',
					'Authorization': process.env.api_key,
				},
			});
			if (response.status === 200) {
				//vscode.window.showInformationMessage(response.data.choices[0].text);
				// Display a message box to the user
				vscode.window.showInformationMessage('Solidity code converted to ink!');
				const filePath = path.join(vscode.workspace.rootPath, `${contract_name}.rs`);
				fs.writeFileSync(filePath, response.data.choices[0].text);

				const openPath = vscode.Uri.file(filePath);

				vscode.workspace.openTextDocument(openPath).then(doc => {
					vscode.window.showTextDocument(doc);
				});
				// const wsedit = new vscode.WorkspaceEdit();
				// const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath; // gets the path of the first workspace folder
				// const filePath = vscode.Uri.file(wsPath + `/ink_contracts/contract.rs`);
				// vscode.window.showInformationMessage(filePath.toString());
				// wsedit.createFile(filePath, { ignoreIfExists: true });
				// vscode.workspace.applyEdit(wsedit);
				// vscode.window.showInformationMessage('Created a new file: ink_contracts/contract.rs');

			}
			else {
				// Unexpected response
				progress.report({message: 'An Error occured'})
				const strUnexpected = `Command Terminated Unsuccessfully: ${response.status} - ${response.statusText}`;
				console.log(strUnexpected);
				vscode.window.showErrorMessage(strUnexpected);
			}
			//return response.data.choices[0].text;
	}catch(error){
		// API has returned an error
		const strError = `Command Terminated Unsuccessfully: ${error.response.status} - ${error.response.statusText}`;
		console.log(strError);
		vscode.window.showErrorMessage(strError);
	}
});
	});

	// @ts-ignore
	context.subscriptions.push(disposable);
	context.subscriptions.push(build);
	// @ts-ignore
	//context.subscriptions.push(copyTextCommand);
// @ts-ignore
	}



// This method is called when your extension is deactivated
function deactivate() {}

// export ResultDetails = {
// 	type: string,
// 	message: string,
// 	details: string,
// 	element: string,
// 	line: number,
// };

// export type Result = {
// 	// eslint-disable-next-line @typescript-eslint/naming-convention
// 	total_errors: number,
// 	// eslint-disable-next-line @typescript-eslint/naming-convention
// 	total_warnings: number,
// 	errors: Object,
// 	warnings: Object,
// };

// export function sanitizeLinebreaks(s: string): string {
// 	return s.replace(/[\r\n]+/g, ' ');
// }

// export function makeDiagnostic(d: ResultDetails, doc: vscode.TextDocument): vscode.Diagnostic {
// 	// Get line number directly from the result details
// 	var rng = new vscode.Range(0, 0, 0, 100); // default
// 	if (d.line) {
// 		// now find out actual length of this line in the doc. VS code lines start from 0 up.
// 		rng = doc.lineAt(d.line - 1).range;
// 	}
// 	// The type string gives the severity - default to "information" unless ERROR or WARN
// 	var sev = vscode.DiagnosticSeverity.Information;
// 	switch (d.type.toUpperCase()) {
// 		case 'WARN':
// 			sev = vscode.DiagnosticSeverity.Warning;
// 			break;

// 		case 'ERROR':
// 			sev = vscode.DiagnosticSeverity.Error;
// 			break;
// 	}
// 	let diagString = sanitizeLinebreaks(d.message) + ': ' + sanitizeLinebreaks(d.details);
// 	if (d.element) {
// 		diagString += '\n' + d.element;
// 	}
// 	let diag = new vscode.Diagnostic(rng, diagString, sev);
// 	diag.source = 'taxi';
// 	return diag;
// }


// export function displayDiagnostics(result: Result, doc: vscode.TextDocument, startTime: Date, showSummary: boolean): vscode.Diagnostic[] {
// 	// Iterate through errors and warnings together, as each object has a type attribute
// 	// concat results into a single array, for ease of iteration
// 	let diags: vscode.Diagnostic[] = [];
// 	// parse errors first, then warnings, as this is the most useful order of presentation
// 	let combined: ResultDetails[] = Object.values(result.errors).concat(Object.values(result.warnings));
// 	for (const e of combined) {
// 		const diag = makeDiagnostic(e, doc);
// 		diags.push(diag);
// 	}
// 	// If enabled, show a final informational diagnostic, showing errors, warnings, and run-time.
// 	if (showSummary) {
// 		const lastLine = doc.lineCount;
// 		const endTime = new Date();
// 		const endTimeStr = endTime.toLocaleTimeString([], { hour12: false });
// 		const duration = (endTime.getTime() - startTime.getTime()) / 1000;
// 		const summary = `At ${endTimeStr}, Taxi for Email validated ${lastLine} lines, found ${result.total_errors} errors, ${result.total_warnings} warnings, in ${duration} seconds.`;
// 		diags.push(new vscode.Diagnostic(new vscode.Range(lastLine, 0, lastLine, 1), summary, vscode.DiagnosticSeverity.Information));
// 	}
// 	return diags;
// }

module.exports = {
	activate,
	deactivate
}
	
