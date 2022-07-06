# Spatial Audio Layout

## Instruction App

When running on a web server, choose a specific .html file to run from for desired layout. 

### Usage

#### Element Navigation

| Keys  | Action |
| ------------- | ------------- |
| Left / Shift+Tab  |  Backward Movement  |
| Right / Tab  | Forward Movement  |

#### Element Interaction

Click on an element or press enter when on an element to interact with it. You should be able to hear spatialized audio when interacting with an element.

### Setup

Requires a web server to run locally.

### Method 1: http-server package

NodeJS & npm are required. If you don't have them, use this guide to install them: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm


1. Install http-server package from npm 
```
npm i -g http-server
```
2. Run http-server in the project directory (spatial-audio-layout-main/)
```
http-server
```

### Method 2: Live Server VSCode Extension (preferred by David)

Download and use the Visual Studio Code Extension called [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).

The GIFs on the marketplace page show how to use it (works with one click)
