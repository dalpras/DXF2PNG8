/**
 * Script for converting DXF to PNG with Illustrator
 *
 * @author Stefano Dal Prà
 */

#target illustrator

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

// Get all files matching the pattern
var files = sourceFolder.getFiles(fileType);

// If a valid folder is selected RUN
if (sourceFolder != null && files.length > 0) {
	main(files);
}

// uncomment to suppress Illustrator warning dialogs
// app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

function main(files) {
	if (files.length > 0) {
		for (var i = 0; i < files.length; i++) {
			var dxfFile = files[i],
			pngFile = createPngFile(destFolder, dxfFile);
			// don't overwrite existing files, skip as soon as possible
			if (pngFile.exists == true) {
				continue;
			}

			sourceDoc = this.app.open(dxfFile, DocumentColorSpace.RGB);

			applyStroke(strokePercent);

			// convert to png and save
			exportDocToPng(pngFile, 750);

			// close the original without saving
			sourceDoc.close(SaveOptions.DONOTSAVECHANGES);
		}
		alert('Files are saved as PNG in ' + destFolder);
	} else {
		alert('No matching files found');
	}
}
/**
 * Create a png file based on dxf path assigned.
 */
function createPngFile(destFolder, dxfFile) {
	var matches = dxfFile.name.match(/([^\/]+)\.DXF$/i);
	return new File(destFolder + '/' + matches[1] + '.png');
}

/**
 * Apply a stroke effect in each element composing the object.
 *
 * @param {int} percent
 *          Percent of stroke increment
 * @returns {void}
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
				// objPath,threshold = 128;
			}
		}
		if (myLayer.typename == "PathItem") {
			var objStrokeWidth = myLayer.strokeWidth;
			myLayer.strokeWidth = objStrokeWidth * percentile;
			myLayer.strokeColor = black;
			// myLayer.tracingMode = TRACINGMODEBLACKANDWHITE;
			// myLayer,threshold = 128;
		}
	}
}

/**
 * Build a RGB Color.
 *
 * @param {int} r
 * @param {int} g
 * @param {int} b
 * @returns {RGBColor}
 */
function makeColor(r, g, b) {
	var c = new RGBColor();
	c.red = r;
	c.green = g;
	c.blue = b;
	return c;
}

/**
 * Process the artboards inside the document applying a 30% size increase and exporting the png.
 *
 * @param {File}
 *
 * @returns {void}
 */
function exportDocToPng(pngFile, minWidth) {
	if (app.documents.length == 0) {
		return;
	}
	var artBds = sourceDoc.artboards;
	var idx = artBds.getActiveArtboardIndex();

	// scale the image to a minimum width of 750 and 30% increase
	var scale = (minWidth / (artBds[idx].artboardRect[2] - artBds[idx].artboardRect[0])) * 100 * 1.3;
	sourceDoc.exportFile(pngFile, ExportType.PNG24, getPngOptions(scale));
}

/**
 * Set the PNG saving options of the files.
 *
 * @param {scale} Scale the image to the value specified
 *
 * @returns {ExportOptionsPNG24}
 */
function getPngOptions(scale) {
	// PNG8
	// var pngExportOpts = new ExportOptionsPNG8();
	// pngExportOpts.colorCount = 4;

	// PNG24
	// Create the PDFSaveOptions object to set the PDF options
	var pngExportOpts = new ExportOptionsPNG24();

	pngExportOpts.antiAliasing = true;
	pngExportOpts.artBoardClipping = false;
	pngExportOpts.saveAsHTML = false;
	pngExportOpts.transparency = true;
	// pngExportOpts.matte = false;
	// pngExportOpts.matteColor = 0, 0, 0;
	// pngExportOpts.transparency = true;
	pngExportOpts.verticalScale = scale;
	pngExportOpts.horizontalScale = scale;

	return pngExportOpts;
}
