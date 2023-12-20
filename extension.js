// The module 'vscode' contains the VS Code extensibility API
const path = require('path');
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

const axios = require('axios');
const fs = require('fs');
const env = require('dotenv').config();

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
			
			if(vscode.window.activeTerminal === undefined){
				const i = vscode.window.createTerminal('inkly')
					i.show(false);
					i.sendText(`cargo contract new new_project${active_terminal}`, true);
			}else{
				vscode.window.activeTerminal.show();
				const terminal = vscode.window.activeTerminal;
				terminal.sendText(`cargo contract new new_project${active_terminal}`, true);
			}
		
		vscode.window.onDidChangeActiveTerminal(e => {

			console.log(`Active terminal changed, name=${e ? e.name : 'undefined'}`);
		});
		active_terminal += 1;
	})

	let build = vscode.commands.registerCommand('inkly.build', function () {
		if(vscode.window.activeTerminal != undefined){
		vscode.window.activeTerminal.show();
		const terminal = vscode.window.activeTerminal;
		terminal.sendText(`cargo contract build`, true);
		}
	})

	let buildRelease = vscode.commands.registerCommand('inkly.build-release', function () {
		if(vscode.window.activeTerminal === undefined){
			const terminal = vscode.window.createTerminal('inkly');
			terminal.show();
			terminal.sendText(`cargo contract build --release`, true);
		}else{
			vscode.window.activeTerminal.show();
		const terminal = vscode.window.activeTerminal;
		terminal.sendText(`cargo contract build --release`, true);
		}
	})

	let test = vscode.commands.registerCommand('inkly.test', function () {
		if(vscode.window.activeTerminal === undefined){
			const e = vscode.window.createTerminal('inkly')
			e.show();
			e.sendText(`cargo test`, true);
		}else{
		vscode.window.activeTerminal.show()
		const terminal = vscode.window.activeTerminal;
		terminal.sendText(`cargo test`, true);
		}
	})

	let createProject = vscode.commands.registerCommand('inkly.install-cargo-contract', async function () {
		if(vscode.window.activeTerminal === undefined){
			const ano = vscode.window.createTerminal('inkly');
				ano.show(false);
				ano.sendText(`cargo install cargo-contract`, true);
		}else{
		vscode.window.activeTerminal.show();	
		const terminal = vscode.window.activeTerminal;
		terminal.sendText(`cargo install cargo-contract`, true);
		}
	})

	let deploy = vscode.commands.registerCommand('inkly.deploy', async function() {
		
		//.then(e => {details = e});
		const URL= "wss://ws.test.azero.dev";
		let args = "";
		let seed = "";

		const first_prompt = await vscode.window.showInputBox({
			prompt: 'Enter your constructor arguments (Don\'t put comma) only space',
		});
		args = first_prompt;

		const third_prompt = await vscode.window.showInputBox({
			 	prompt: 'Enter your 12-word seed phrase of the account deploying',
			 });
		seed = third_prompt;

		if(seed === "" || undefined){
			vscode.window.showInformationMessage('12-word Seed phrase cannot be empty')
		}else{
			if(vscode.window.activeTerminal != undefined){
				vscode.window.activeTerminal.show();
				vscode.window.activeTerminal.sendText(`cargo contract instantiate --suri "${seed}" --url "${URL}" \ --args ${args === undefined ? "" : args} --execute`, true);
			} else {
			 	const terminal = vscode.window.createTerminal('inkly');
				terminal.show();
			 	terminal.sendText(`cargo contract instantiate --suri "${seed}" --url "${URL}" \ --args ${args === undefined ? "" : args} --execute`, true);
			 }
			}
	})
	// @ts-ignore
	let disposable = vscode.commands.registerCommand('inkly.convert', async function () {
		// The code you place here will be executed every time your command is executed
		//vscode.commands.executeCommand('inkly.copyText');

		const doc = vscode.window.activeTextEditor;
		
		const fileName = doc.document.fileName;
		
		if (!doc) {
			vscode.window.showInformationMessage('No open solidity file, please open a file to begin');
			return;
		}else if(fileName.substring(fileName.length - 4, fileName.length) != ".sol"){
			vscode.window.showInformationMessage('The active window is not a solidity file, please select a Solidity file to begin');
			return;
		}
		// @ts-ignore
		// @ts-ignore
		const splitted = fileName.split('\\');
		let contract_name = 'contract';
		splitted.map(function (e, i, array){
			const p = e.includes('.sol');
			if(p === true){
				array[i].split('.').map(function(y, r, t){
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
								"prompt": `Convert this solidity code to !ink smart contract code: ${docStream}`,
								"max_tokens": process.env.max_tokens,
								"model": process.env.model,
								"seed" : 1
							},{
								headers: {
									'Content-Type' : 'application/json',
									'Authorization': process.env.api_key,
								},
							});
							if (response.status === 200) {
								// Display a message box to the user
								vscode.window.showInformationMessage('Solidity code converted to ink!');
								if (fs.existsSync(vscode.workspace.rootPath + "/ink_contracts")){
									const filePath = path.join(`${vscode.workspace.rootPath}/ink_contracts/`, `${contract_name}.rs`);
								fs.writeFileSync(filePath, `#![cfg_attr(not(feature = "std"), no_std, no_main)] \n${response.data.choices[0].text}`);
				
								const openPath = vscode.Uri.file(filePath);
				
								vscode.workspace.openTextDocument(openPath).then(doc => {
									vscode.window.showTextDocument(doc);
								});
								}else{
									fs.mkdirSync(vscode.workspace.rootPath + "/ink_contracts");
									const filePath = path.join(`${vscode.workspace.rootPath}/ink_contracts/`, `${contract_name}.rs`);
									fs.writeFileSync(filePath, `#![cfg_attr(not(feature = "std"), no_std, no_main)] \n${response.data.choices[0].text}`);
					
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
								const strUnexpected = `Command Terminated Unsuccessfully: ${response.status} - ${response.statusText}`;
								vscode.window.showErrorMessage(strUnexpected);
							}
							//return response.data.choices[0].text;
					}catch(error){
						// API has returned an error
						console.log(error);
						const strError = `Command Terminated Unsuccessfully: ${error.response.status} - ${error.response.statusText}`;
						vscode.window.showErrorMessage(strError);
					}}
		 		)}
			
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
}
// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
	
