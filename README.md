# inkly

Inkly is a robust VScode extension that is built to support !ink smart contract development, testing and deployment and to make it easier for EVM developers to transition to the !ink ecosystem with its rich set of functionalities. One of the challenges I faced transitioning from an EVM background to Substrate and !ink was converting my solidity contracts to !ink. I had to re-write some of my contracts in Solidity from scratch, this spurred me to build this tool apart from it being able to aid your !ink project creation from ground up `inkly create project` till deploying `inkly deploy` on Aleph zero testnet (more chains coming soon...), it can aid in transitioning solidity contracts to !ink. It aims to take the burden off both new and existing !ink developers from having to memorise all the cargo contract commands.  


### VSCode MarketPlace link
https://marketplace.visualstudio.com/items?itemName=JoshuaOkoro.inkly

## Key Ideas Overview of Architecture
It is a VScode extention that creates, initilises, builds, tests and deploys !ink contracts on chain (Aleph zero) as well as aiding Solidity to !ink conversion. The main file is the `extension.js` file 
  
## Features

* `inkly convert` is used to convert solidity contracts to !ink and puts it in all converted files named with their original solidity names in a directory called _ink_contracts_
Eg:    contracts/contract.sol -> ink_contracts/contract.rs
  
* `inkly install cargo-contract` installs the crate that manages !ink development, testing and deployment.
  
* `inkly create project` creates a new !ink project directory with _cargo.toml_ and _lib.rs_ files.
  
* `inkly build` builds a debug version of the !ink contract.
  
* `inkly build release` builds the contract for release.
  
* `inkly test` for running tests for the contract
  
* `inkly deploy` deploys the build wasm module to Aleph zero testnet.
   
> Tip: Ensure to close any open panels before running `inkly convert`. 

## Requirements

* An Internet connection is needed when running this extension.   
* In other to avoid the switching of focus to the wrong window, when running `inkly convert` close any open _VScode panels_ before running, ensure only the window with the solidity file(s) is open.
  ![Screenshot (212)](https://github.com/josidbobo/aleph-zero-project/assets/38986781/36b3041f-0a9e-4a9e-bf69-0889a7c7f16b)

## Set Up  
To set up, you need an api key from [openAI](https://openai.com) and append to your `.env` file.
Every other necessary details can be found [here](https://platform.openai.com/docs/guides/text-generation/completions-api)

## Release Notes

It currently has about 7 versions, with the most recent _0.0.7_ 

## Working with Markdown

You can author your README using Visual Studio Code.  Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets
