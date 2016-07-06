/**
 * Script for converting DXF to PNG with Illustrator
 *
 * @author Stefano Dal Prà
 */

// #target illustrator

// The Document used for exporting must be outside the function for
// avoiding page setup every time.
var sourceDoc;

// Select the source folder.
var sourceFolder = Folder.selectDialog('Select the folder with Illustrator files you want to convert to PNG', '~');

// Select files to convert.
var fileType = prompt('Select type of Illustrator files to you want to process. (es: *.dxf)', '*.dxf');

// Select stroke for lines
var strokePercent = prompt("Choose your stroke line increase in percent (es. 0-infinite)", "200", "Change width stroke");

// Get the destination to save the files
var destFolder = Folder.selectDialog('Select the folder where you want to save the converted PNG files.', '~');

// If a valid folder is selected RUN
if (sourceFolder != null) {
	// Get all files matching the pattern
	var files = sourceFolder.getFiles(fileType);
	if (files.length > 0) {
		main(files);
	} else {
		alert('No matching files found');
	}
}

/**
 * Main processing function.
 * 
 * @param {Array} files Array of Files to process.
 */
function main(files) {
	//Append to LOGFILE
	var logger = new File(Folder.desktop + "/illustrator-log.txt");
	var toDay = new Date();
	logger.open("a", "TEXT");
    logger.write("Start batch processing at " + toDay.getDate() + " " + toDay.getHours() + ":" + toDay.getMinutes() + ":" + toDay.getSeconds() + "\n");

	for (var i = 0; i < files.length; i++) {
		var dxfFile = files[i],
		pngFile = createPngFile(destFolder, dxfFile);
		
		// don't overwrite existing files, skip as soon as possible
		if (pngFile.exists == true) {
			continue;
		}

		//Write the info to the file
		logger.write("Processing: " + pngFile.name + "\n");
		
		// uncomment to suppress Illustrator warning dialogs
		app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
		sourceDoc = app.open(dxfFile, DocumentColorSpace.RGB);

		applyStroke(strokePercent);

		// convert to png and save
		exportDocToPng(pngFile, 750);

		// close the original without saving
		sourceDoc.close(SaveOptions.DONOTSAVECHANGES);
	}
	//Close the log
	logger.close();	
	
	alert('Files are saved as PNG in ' + destFolder);
}

/**
 * Create a png file based on dxf path assigned.
 * 
 * @param {string} Target PNG Folder PathItem
 * @param {File} Source DXF File to convert
 */
function createPngFile(destFolder, dxfFile) {
	var matches = dxfFile.name.match(/([^\/]+)\.DXF$/i);
	return new File(destFolder + '/' + matches[1] + '.png');
}

/**
 * Apply a stroke effect in each element composing the object.
 *
 * @param {int} percent Percent of stroke increment
 */
function applyStroke(percent) {
	var percentile = percent / 100,
	black = new GrayColor();
	black.gray = 100;

	// choose all page elements
	for (var i = 0; i < app.activeDocument.pageItems.length; i++) {
		var myLayer = app.activeDocument.pageItems[i];
		//if element is compound make a new loop for pathItems
		if (myLayer.typename == "CompoundPathItem") {
			for (var u = 0; u < myLayer.pathItems.length; u++) {
				//take actual stroke size
				var objPath = myLayer.pathItems[u];
				var objStrokeWidth = objPath.strokeWidth;

				//transform the stroke width into % choose at start
				objPath.strokeWidth = objStrokeWidth * percentile;
				objPath.strokeColor = black;
				// objPath.tracingMode = TRACINGMODEBLACKANDWHITE;
				// objPath.threshold = 128;
			}
		}
		if (myLayer.typename == "PathItem") {
			var objStrokeWidth = myLayer.strokeWidth;
			myLayer.strokeWidth = objStrokeWidth * percentile;
			myLayer.strokeColor = black;
			// myLayer.tracingMode = TRACINGMODEBLACKANDWHITE;
			// myLayer.threshold = 128;
		}
	}
}

/**
 * Process the artboards inside the document applying a 30% size increase and exporting the png.
 *
 * @param {File} pngFile Target PNG file
 * @param {double} size Target size constraints of PNG
 */
function exportDocToPng(pngFile, size) {
	if (app.documents.length == 0) {
		return;
	}
	var artBds = sourceDoc.artboards;
	var idx = artBds.getActiveArtboardIndex();

	// scale the image to a minimum width of 750 and 30% increase
	var objScale = (size / (artBds[idx].artboardRect[2] - artBds[idx].artboardRect[0])) * 100 * 1.3;
	exportFileToPNG24(pngFile, objScale);
}

/**
 * Exports current document to pngFile as a PNG24 file with specified options.
 *
 * @param {File} pngFile Destination png file
 * @param {double} objScale Scaling for size constraints
 */
function exportFileToPNG24(pngFile, objScale) {
	if (app.documents.length > 0) {
		var exportOptions = new ExportOptionsPNG24();
		var type = ExportType.PNG24;

		exportOptions.antiAliasing = true;
		// exportOptions.artBoardClipping = false;
		exportOptions.transparency = true;
		// exportOptions.saveAsHTML = false;
		exportOptions.verticalScale = objScale;
		exportOptions.horizontalScale = objScale;
		sourceDoc.exportFile(pngFile, type, exportOptions);
	}
}

