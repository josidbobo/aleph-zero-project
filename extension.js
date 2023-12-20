// The module 'vscode' contains the VS Code extensibility API
const path = require('path');
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

const axios = require('axios');
const fs = require('fs');
const env = require("dotenv");

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
	 let active_terminal = 0;

	let init = vscode.commands.registerCommand('inkly.initialise-new', async function () {
			const terminal = vscode.window.activeTerminal;
			terminal.sendText(`cargo contract new new_project${active_terminal}`, true);
		
		vscode.window.onDidChangeActiveTerminal(e => {

			console.log(`Active terminal changed, name=${e ? e.name : 'undefined'}`);
		});
		active_terminal += 1;
	})

	let build = vscode.commands.registerCommand('inkly.build', function () {
		const terminal = vscode.window.activeTerminal;
		terminal.sendText(`cargo contract build`, true);
	
	})

	let buildRelease = vscode.commands.registerCommand('inkly.build-release', function () {
		const terminal = vscode.window.activeTerminal;
		terminal.sendText(`cargo contract build --release`, true);
	})

	let test = vscode.commands.registerCommand('inkly.test', function () {
		const terminal = vscode.window.activeTerminal;
		terminal.sendText(`cargo test`, true);
	})

	let createProject = vscode.commands.registerCommand('inkly.install-cargo-contract', async function () {
		const terminal = vscode.window.activeTerminal;
		terminal.sendText(`cargo install cargo-contract`, true);
	})

	let deploy = vscode.commands.registerCommand('inkly.deploy', async function() {
		
		//.then(e => {details = e});
		const URL= "wss://ws.test.azero.dev";
		let token_name = "";
		let args = "";
		let seed = "";

		const re = await vscode.window.showInputBox({
			prompt: 'Enter your constructor arguments (Don\'t put comma)',
		});
		args = re;

		const te = await vscode.window.showInputBox({
			prompt: 'Enter your contract_name',
		})
		token_name = te;

		const ye = await vscode.window.showInputBox({
			 	prompt: 'Enter your 12-word seed phrase (each separated by a comma) of the account deploying',
			 });
		seed = ye;

		const terminal = vscode.window.activeTerminal;
		terminal.sendText(`cargo contract instantiate --suri "${seed}" --url "${URL}" \ --constructor ${token_name} \ --args ${args}`, true);

		
		
		//then((e) => {
		// 	args = e;
		// 	console.log(args);
		// 	vscode.window.showInputBox({
		// 		prompt: 'Enter your contract_name',
		// 	}).then((e) => {
		// 		token_name = e;
		// 		console.log(token_name);
		// vscode.window.showInputBox({
		// 	prompt: 'Enter your 12-word seed phrase (each separated by a comma) of the account deploying',
		// }).then((e) => {
		// 	seed = e
		// 	console.log(seed);});
		// 	});
		// 			});

		// await re;
		//if(seed == ""){
		//	vscode.window.showInformationMessage('Seed phrase wasn\'t added can\'t deploy without it');
		//	return;
		//	}else{
				
		//	}


		

		
	
		// 	const new_details = details.split(";");
		// 	seed = new_details[0];
		// 	token_name = new_details[1];
		// 	args = new_details[2];
//			vscode.window.showInformationMessage('Seed phrase wasn\'t added can\'t deploy without it');
//			return;

	})
	// @ts-ignore
	let disposable = vscode.commands.registerCommand('inkly.convert', async function () {
		// The code you place here will be executed every time your command is executed
		//vscode.commands.executeCommand('inkly.copyText');
 
		//const copyHandler = import("clipboardy");
		// @ts-ignore
		vscode.window.terminals.map(function(v, r, t){
			v.hide();
		})
		//vscode.ViewColumn.Active

		const doc = vscode.window.activeTextEditor;
		
		const fileName = doc.document.fileName;
		console.log(`fILEnAME: ${fileName}`)
		
		if (!doc) {
			vscode.window.showInformationMessage('No open solidity file, please open a file to begin');
			return;
		}else if(fileName.substring(fileName.length - 4, fileName.length) != ".sol"){
			vscode.window.showInformationMessage('The active window is not a solidity file, please select a Solidity file to begin');
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
		require('dns').resolve('www.google.com', async function(err){
			if(err){
				console.log('No connection');
				vscode.window.showErrorMessage('Internet is not connected')
			} else{
		 vscode.window.withProgress(
			{
				cancellable: false,
				location: vscode.ProgressLocation.Notification,
				title: 'inkly',
			}, async (progress) => {
				progress.report({message: 'Converting to !ink'});
					
						try{
							const response = await axios.post(process.env.url, {
								"prompt": `${process.env.message}`,
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
								if (fs.existsSync(vscode.workspace.rootPath + "/ink_contracts")){
									const filePath = path.join(`${vscode.workspace.rootPath}/ink_contracts/`, `${contract_name}.rs`);
								fs.writeFileSync(filePath, `#![cfg_attr(not(feature = "std"), no_std, no_main)] \n\n${response.data.choices[0].text}`);
				
								const openPath = vscode.Uri.file(filePath);
				
								vscode.workspace.openTextDocument(openPath).then(doc => {
									vscode.window.showTextDocument(doc);
								});
								}else{
									fs.mkdirSync(vscode.workspace.rootPath + "/ink_contracts");
									const filePath = path.join(`${vscode.workspace.rootPath}/ink_contracts/`, `${contract_name}.rs`);
									fs.writeFileSync(filePath, `#![cfg_attr(not(feature = "std"), no_std, no_main)] \n\n${response.data.choices[0].text}`);
					
									const openPath = vscode.Uri.file(filePath);
					
									vscode.workspace.openTextDocument(openPath).then(doc => {
										vscode.window.showTextDocument(doc);
									});
								}
								
								
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
								console.log(response);
								const strUnexpected = `Command Terminated Unsuccessfully: ${response.status} - ${response.statusText}`;
								console.log(strUnexpected);
								vscode.window.showErrorMessage(strUnexpected);
							}
							//return response.data.choices[0].text;
					}catch(error){
						// API has returned an error
						console.log(error);
						const strError = `Command Terminated Unsuccessfully: ${error.response.status} - ${error.response.statusText}`;
						console.log(strError);
						vscode.window.showErrorMessage(strError);
					}	
					}
		 )
			}
			
			})
	
});

	// @ts-ignore
	context.subscriptions.push(disposable);
	context.subscriptions.push(init);
	context.subscriptions.push(build);
	context.subscriptions.push(buildRelease);
	context.subscriptions.push(test);
	context.subscriptions.push(deploy);
	context.subscriptions.push(createProject);


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
	
