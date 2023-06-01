# Idea Sandbox Prioritizer
#### Tool to help you put your tasks in order by using forced-choice comparison.
---
## Background
This project started in '07 or '08 with the desire to find a better tool to help

## The Files

### template-prioritizer.php (2023 version)
This file is what powers the Prioritizer on the Idea Sandbox website. It is the index.html for the Prioritizer. That site uses Wordpress, so this is a template page wiht the html in place - hidden within the .php needed by Wordpress to work.

You can see how this document pulls in the .js and .css files

### index.htm (2007/08 version)
This is an early version of the page that powered the Prioritizer before Wordpress was used. I have the image files that this document calls for (for the header), but they are a little out of date for the look of the 2023 Idea Sandbox site.

### printable.htm
This is what a user sees when they finish Prioritizing. It creates a dated, ready-for-print checklist for the day's tasks. There are also additional spaces for notes.

### prioritizer.css
Styles the Prioritizer.

### prioritizer.js
This defines the prioritization system. It uses PrototypeJS and needs to be updated.

### prototype.js
I believe this is the math behind what makes the tool work.

### IMAGE FILES
- lines.png - provide the lines for the printable version for extra writing space
- sandbox_bottom.gif - an Idea Sandbox logo pattern which would appear on the bottom of the Prioritizer tool as you work
- script.jpg - Idea Sandbox logo
