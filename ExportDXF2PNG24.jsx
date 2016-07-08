/**
 * @@@BUILDINFO@@@ ExportDXF2PNG24.jsx !Version! Wed Jul 06 2016 13:32:12 GMT+0200
 *
 * Script for converting DXF to PNG with Illustrator
 *
 * @author Stefano Dal Prà
 */

#target illustrator

// if $.level is set to 0 or 1, breakpoints are disabled
$.level = 2;

// The Document used for exporting must be outside the function for
// avoiding page setup every time.
var sourceDoc,
	skipFileStroke = 'N'; // set stroke for all files

// Select the source folder.
var sourceFolder = Folder.selectDialog('Select the folder with Illustrator files you want to convert to PNG', '~');

// Select files to convert.
var fileType = prompt('Select type of Illustrator files to you want to process. (es: *.dxf)', '*.dxf');

// Select stroke for lines
var strokePercent = prompt("Choose your stroke line increase in percent: >= 0 (very CPU intensive! enter 0 if your PC is not fast enough)", "200", "Change width stroke");

// Select stroke for lines
if (strokePercent > 0) {
	// ask if stroke has to be skipped for the first file processed
	skipFileStroke = prompt("Skip stroke for the first file in directory: Y/N", "N");
}

// Get the destination to save the files
var destFolder = Folder.selectDialog('Select the folder where you want to save the converted PNG files.', '~');

// File process logger
var logger = new File(Folder.desktop + "/illustrator-log.txt");

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
	
	for (var i = 0; i < files.length; i++) {
		var dxfFile = files[i],
		pngFile = createPngFile(destFolder, dxfFile);

		// don't overwrite existing files, skip as soon as possible
		if (pngFile.exists == true) {
			continue;
		}

		//Write the info to the file
		log(dxfFile.name);
		
		// uncomment to suppress Illustrator warning dialogsOpenOptionsAutoCAD
		app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

		// options for autocad documents
		with (app.preferences) {
			centerArtwork = true;
			globalScaleOption = AutoCADGlobalScaleOption.FitArtboard;
			//globalScaleOption = AutoCADGlobalScaleOption.ScaleByValue;
			//globalScaleOption = AutoCADGlobalScaleOption.OriginalSize;
			globalScalePercent = "100.0";
			// mergeLayers = true;
			scaleLineweights = false;
			unit = AutoCADUnit.Millimeters;
			// unit = AutoCADUnit.Pixels;
			unitScaleRatio = "1.0";
		}

		sourceDoc = app.open(dxfFile, DocumentColorSpace.RGB);
		// alert(countPathItems());
		
		// in the first loop skipFileStroke allow to skip stroking
		if (strokePercent > 0 && skipFileStroke == 'N') {
			// very CPU intensive!
			applyStroke(strokePercent);
		}
		// for next loop stroking is setted again, as far as strokePercent > 0
		skipFileStroke = 'N';

		// convert to png and save
		exportDocToPng(pngFile, 750);

		// close the original without saving
		sourceDoc.close(SaveOptions.DONOTSAVECHANGES);
	}
	alert('Files are saved as PNG in ' + destFolder);
}

/**
 * Save a message to logfile.
 *
 * @param {string} message
 */
function log(message) {
	var hasLogger = false;
	if (logger !== '') {
		//Open the file for writing.
		hasLogger = logger.open('a', undefined, undefined);
		logger.encoding = "UTF-8";
		logger.lineFeed = "Windows";
	}
	// got an output?
	if (hasLogger === false) {
		return;
	}
	var toDay = new Date();
	logger.writeln(toDay.toLocaleTimeString() + ": " + message);
	//Close the log
	logger.close();	
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
 * Iterate through all document pathItems and apply a callback 
 * function to all pathItems found.
 *
 * @param {function} Function to apply to pathItem found.
 */
function loopDocumentPathItems(callback) {
	if (callback !== undefined && typeof callback == 'function') {
		// choose all page elements
		for (var i = 0; i < app.activeDocument.pageItems.length; i++) {
			var myLayer = app.activeDocument.pageItems[i];
			//if element is compound make a new loop for pathItems
			if (myLayer.typename == "CompoundPathItem") {
				for (var u = 0; u < myLayer.pathItems.length; u++) {
					var objPath = myLayer.pathItems[u];
					callback(objPath);
				}
			}
			if (myLayer.typename == "PathItem") {
				callback(myLayer);
			}
		}
	}
}
/**
 * Count the number of pathItems in the document
 */
function countPathItems() {
	var num = 0;
	loopDocumentPathItems(function(pathItem) {
		num++;
	});	
	return num;
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
	loopDocumentPathItems(function(pathItem) {
		var objStrokeWidth = pathItem.strokeWidth;
		//transform the stroke width into % choose at start
		pathItem.strokeWidth = objStrokeWidth * percentile;
		pathItem.strokeColor = black;
		// objPath.tracingMode = TRACINGMODEBLACKANDWHITE;
		// objPath.threshold = 128;		
	});
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
		with (exportOptions) {
			antiAliasing = true;
			// artBoardClipping = false;
			transparency = true;
			// saveAsHTML = false;
			verticalScale = objScale;
			horizontalScale = objScale;
		}
		sourceDoc.exportFile(pngFile, type, exportOptions);
	}
}
