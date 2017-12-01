# The EZ-PZ Tile Management System

## System Release Notes
### Version 1.0



Team 7203: EZ-PZ 
John Berry | Marcus Thomas | Kaley Findley | Abdullah Saibu | William Hornsby








## Introduction
The EZ-PZ Tile Management system provides a system that aids park administrators in altering the games being played on the tiles while avoiding disruption to the visitors currently making use of the PZ tile network. This system allows for the creation of an activity, the reservation of tiles, and the subsequent mapping of tiles. 

## *Functionality*
The following is a list of working functionality with a description of what tasks the functionality performs. While not as much functionality as the EZ-PZ team would like to have, it is a very useful set of core functionalities that have been provided through this application.
### *Activity Creation*
When creating a new activity, you are creating a wrapper for a game type that must have a unique name in relation to other activities wrapping the same game type. An activity must hold a game type and cannot be created without one. This is because the game type that an activity is wrapping gives the activity the functionality that it will give to tiles once they are reserved and mapped. The main purpose of having activities as wrappers to game types is to allow the operation of multiple instances of the same game type. Once an activity is created, the activity may be deleted at any time.
### *Tile Reservation*
Tile reservation allows an activity to claim tiles so that it has the explicit right to make use of the tile in whatever way that it needs. It can have the tile do the laundry or mop the floor if needed. Seriously? No, the tiles don’t have that capability, but the activity can certainly have the steps on a tile perform different functionalities from simply lighting up to being a smaller part of controlling some complex control system to a video game being played. Tile reservation serves its main purpose by preventing multiple activities from attempting to use the same tile for different functions. Once an activity has claimed a tile, no other activities may use it until it has been released from reservation. The functionality to both reserve and unreserve a tile is working properly.
### *Tile Mapping*
Once reserved, a tile may be mapped to do functions that the game type is able to give it. The mapping is similar to that of the mapping of buttons on a controller to different functions such as “jump” or “shoot” in a video game. Think of the tile network as a giant controller designed to put on light shows and control multiple games all at once. The mapping of tiles may be changed or completely removed at any time that a user chooses.

### *User Registration & Login* 
A user may create an account by entering username, password and setting security questions to recover their account in case they misplace their credentials. 

After doing so, a user may log in using the created credentials.

## Comparable Products
This is a custom piece of software for the narrow and singular purpose of making it easier to manage a large network of 718 tiles designed to look like the earth, the moon, mars, and the international space station. As such, it is unique in its intent to control such a custom network of PZ tiles and in its functionality. The only things that might be similar are custom pieces of software created to control some kind of light shows, but that is not enough on its own to be comparable relavantly comparable to this project.

## Upgrades
As an initial release, there are no upgrades to the product.
New Features
As a first release, there are no new features that aren’t listed in the functionality section.

## Bugs
There is a bug when selecting tiles (either in reservation or mapping) where the tile selected when the mouse is clicked may not be the tile the mouse is directly over. This only happens when the mouse is close to the border of a tile, and occurs due to slightly incorrect math that calculates tile index from mouse position. The bug should not severely affect performance, as it is nothing that cannot be undone before data is saved to the database. To mitigate this bug, simply deselect the incorrectly selected tile and select the desired tile by clicking closer to the center of the tile.

## Issues
There is no data visualization since we had no access to the data to see what type of visualization would best suit the type of data needing to be plotted, charted, or otherwise represented. There is also no way to change the sensing method of a tile in this application’s current form.  An additional minor issue is the fact that a user cannot delete an activity from the park. 

Aside from functionality, the application has only been tested in some desktop web browsers (largely tested in chrome) and does not make any promises that the sight would work well on a mobile phone or tablet. While we at one time had issues with the styling of the application while using a safari browser, the issues are thought to be fixed.




# Installation Guide


## Web Browser
As much of the development was performed using google chrome browsers, this is our highly recommended browser of choice. You may attempt to run the application on another browser, but it may not look as clean as it would in the chrome browser. To download this browser, simply perform a google search at www.google.com and search for “google chrome.” Once the search has been performed, under the first search result should be a button reading “Download Now.” Simply click this link to be brought to the download page of the browser and you should see, on the left side of the screen, a blue button that reads “Download Chrome.” Click that to begin downloading the chrome web browser. Once the download is complete, simply open the downloaded .dmg (macOS) or .exe (Windows) and follow the installation instructions given by the installer.

## Server-Side Setup
Setting up the local server is a fairly simple process.  First, it requires the latest version of npm/node installed.  Navigate to this page to download npm and node: https://www.npmjs.com/get-npm. Once that is downloaded successfully, navigate to the root directory of the PZ Tile App in Terminal (or Command Line).  Type in the following command to install all the necessary dependencies (from the package.json file) required to run the application: npm install.  This may take a couple minutes to complete.  Once finished, stay in the current directory, and type in the following command to start the server: node index.js.

## Navigating to the Webpage
Once the server is up and running, the web page will now work perform all functionalities provided that are laid out within the release notes. If hosting the server locally, we currently have the webpage and server coded to run on the local port number 8080, So simply type into your browser “localhost:8080” and you should be directed directly to the login page. From here, you may choose to login, reset your password, or register if you haven’t yet done so.
