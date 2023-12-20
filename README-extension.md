# inkly README

Inkly is a robust extension that is built to support !ink smart contract development, testing and deployment and to make it easier for EVM developers to transition to the !ink ecosystem with its rich set of functionalities.    

![main-extension](https://github.com/josidbobo/aleph-zero-project/assets/38986781/b70d81dd-3f8b-4ca6-8ab8-6a5b26207e0e)
  

## Features

* `inkly convert` is used to convert solidity code to !ink contract and puts it in a defaultfolder _ink_contracts_ with the original solidity file name.  
* `inkly install cargo-contract` installs the crate that manages !ink development, testing and deployment.  
* `inkly create project` creates a new !ink project directory with _cargo.toml_ and _lib.rs_ files.
* `inkly build` builds a debug version of the !ink contract.  
* `inkly build release` builds the contract for release.
* `inkly test` for running tests for the contract
* `inkly deploy` deploys the build wasm module to Aleph zero testnet.
   
> Tip: Ensure to close any open panels before running `inkly convert`.

## Requirements

* An Internet connection is needed when running this extension.   
* In other to avoid the switching of focus to the wrong file, when running `inkly convert` close any open panels before running, ensure only the window with the solidity file(s) is open.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.1

Initial release of extension

### 0.0.3
Logo and animation added to ReadMe

### 0.0.7

Fixed static terminal and gif 

## Working with Markdown

You can author your README using Visual Studio Code.  Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
