// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const axios = require('axios');
// @ts-ignore
const formData = require('form-data');


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
// @ts-ignore
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extensi
	console.log('inkly is now active!');
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let dcoll = vscode.languages.createDiagnosticCollection('taxi');
	// @ts-ignore
	let disposable = vscode.commands.registerCommand('inkly.convert', function () {
		// The code you place here will be executed every time your command is executed
		//vscode.commands.executeCommand('inkly.copyText');
 
		// Display a message box to the user
		vscode.window.showInformationMessage('Solidity code converted to !ink!');
		//const copyHandler = import("clipboardy");
		// @ts-ignore
		const env = require("dotenv").config();
		
		const doc = vscode.window.activeTextEditor;
		if (!doc) {
			vscode.window.showInformationMessage('No open solidity file, please open a file to begin');
			return;
		}
		// @ts-ignore
		//console.log(`Taxi for Email: sending ${doc.document.lineCount} lines for validation`);
		// @ts-ignore
		const fileName = doc.document.fileName;
		// @ts-ignore
		const docStream = doc.document.getText();

		var formData = new FormData();
		//formData.append('html', docStream, { filename: fileName });
		// @ts-ignore
		var fh = formData.getHeaders();
		fh['Accept'] = 'application/json';
		// @ts-ignore
		fh['Authorization'] = `Bearer ${process.env.api-key}`;

		axios({
			method: 'post',
			url: 'https://api.openai.com/v1/completions/',
			headers: fh,
			data: {
				"prompt": `Convert this Solidity Code to !ink: "${docStream}"`,
				"max_tokens": 256,
				"model": "gpt-4"
			},
		})
			.then(response => {
				if (response.status === 200) {
					console.log(response.data);
					vscode.window.showInformationMessage(response.data.choices[0].text);

					// @ts-ignore
					//const diags = displayDiagnostics(response.data.choices[0].text, doc.document, startTime, !!showSummary);
					// @ts-ignore
					//dcoll.delete(doc.document.uri);
					// @ts-ignore
					//dcoll.set(doc.document.uri, diags);
				}
				else {
					// Unexpected response
					const strUnexpected = `Command Terminated Unsuccessfully: ${response.status}  - ${response.statusText}`;
					console.log(strUnexpected);
					vscode.window.showErrorMessage(strUnexpected);
				}
			})
			.catch(error => {
				// API has returned an error
				const strError = `Command Terminated Unsuccessfully: ${error.response.status} - ${error.response.statusText}`;
				console.log(strError);
				vscode.window.showErrorMessage(strError);
			});
	});

		
	// @ts-ignore
	context.subscriptions.push(disposable);
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
