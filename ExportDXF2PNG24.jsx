/**
 * Script for converting DXF to PNG with Illustrator
 * 
 * @author Stefano Dal Prà
 */

// uncomment to suppress Illustrator warning dialogs

var destFolder,
    files,
    fileType,
    sourceDoc,
    targetFile,
    pngExportOpts,
    sizes
    ;

// Select the source folder.
var sourceFolder = Folder.selectDialog('Select the folder with Illustrator files you want to convert to PNG', '~');

// If a valid folder is selected
if (sourceFolder != null)
{
    files = new Array();
    fileType = prompt('Select type of Illustrator files to you want to process. Eg: *.dxf', '');
    // Get all files matching the pattern
    files = sourceFolder.getFiles(fileType);
    // app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

    if (files.length > 0) {
        // Get the destination to save the files
        destFolder = Folder.selectDialog('Select the folder where you want to save the converted PNG files.', '~');
        for (i = 0; i < files.length; i++) {
            sourceDoc = app.open(files[i], DocumentColorSpace.RGB); // returns the document object
            // don't overwrite existing files
            if ( sourceDoc.exists == true ) {
                continue;
            }            
            var percent = prompt("Choose your %", "200", "Change width stroke");
            applyStroke(percent);
            
            // convert to png and save
            artboardToPNGs();

            // close the original without saving
            sourceDoc.close(SaveOptions.DONOTSAVECHANGES);
        }
        alert('Files are saved as PNG in ' + destFolder);
    } else {
        alert('No matching files found');
    }
}

/**
 * Apply a stroke effect in each element composing the object.
 * 
 * @param {int} percent 
 *          Percent of stroke increment
 * @returns {void}
 */
function applyStroke(percent) {
    var percentile = percent / 100;

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
                objPath.strokeColor = makeColor(0,0,0);
                // objPath.tracingMode = TRACINGMODEBLACKANDWHITE;
                // objPath,threshold = 128;
            }
        }
        if (myLayer.typename == "PathItem") {
            var objStrokeWidth = myLayer.strokeWidth;
            myLayer.strokeWidth = objStrokeWidth * percentile;
            myLayer.strokeColor = makeColor(0,0,0);
            // myLayer.tracingMode = TRACINGMODEBLACKANDWHITE;
            // myLayer,threshold = 128;
        }
    }
}

/**
 * build a RGB Color.
 * 
 * @param {int} r
 * @param {int} g
 * @param {int} b
 * @returns {RGBColor}
 */
function makeColor(r,g,b){
    var c = new RGBColor();
    c.red   = r;
    c.green = g;
    c.blue  = b;
    return c;
}

/**
 * Process the artboards inside the document applying a 30% size increase and exporting the png.
 * 
 * @returns {void}
 */
function artboardToPNGs() {
    if (parseFloat(app.version) < 15) {
        return;
    }
    if (app.documents.length == 0) {
        return;
    }
    var matches = sourceDoc.name.match(/([a-z0-9_\-\.]+)\.DXF$/i);
    var pngFile = File(destFolder + '/' + matches[1] + '.png');
    var size   = 750;
    var artBds = sourceDoc.artboards;
    var idx    = artBds.getActiveArtboardIndex();
    // var abName  = artBds[ idx ].name;

    // nel fattore scala definisco di aumentare di un 30% la dimensione dell'immagine DXF da elaborare, 
    var scale = (size / (artBds[ idx ].artboardRect[2] - artBds[ idx ].artboardRect[0])) * 100 * 1.3;
    //pngFile = File( dF.fsName + '/' + abName + '_00' + sizes[j] + 'x' + sizes[j] + '.png' );

    var pngOptions = getPngOptions();
    pngOptions.horizontalScale = pngOptions.verticalScale = scale;
    
    sourceDoc.exportFile(pngFile, ExportType.PNG24, pngOptions);
}

/**
 * Set the PNG saving options of the files using the PDFSaveOptions object.
 * 
 * @returns {ExportOptionsPNG24}
 */
function getPngOptions()
{
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
    // pngExportOpts.verticalScale = 416.667;
    // pngExportOpts.horizontalScale = 416.667;   

    return pngExportOpts;
}
 