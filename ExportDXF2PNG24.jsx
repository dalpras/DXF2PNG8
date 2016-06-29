
// Main Code [Execution of script begins here]
 
// uncomment to suppress Illustrator warning dialogs
// app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
 
var destFolder, sourceFolder, files, fileType, sourceDoc, targetFile, pngExportOpts, sizes;
 
// Select the source folder.
sourceFolder = Folder.selectDialog( 'Select the folder with Illustrator files you want to convert to PNG', '~' );
 
// If a valid folder is selected
if ( sourceFolder != null )
{
    files = new Array();
    fileType = prompt( 'Select type of Illustrator files to you want to process. Eg: *.ai', ' ' );
    // Get all files matching the pattern
    files = sourceFolder.getFiles( fileType );
    app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
    
    if ( files.length > 0 )
    {
        // Get the destination to save the files
        destFolder = Folder.selectDialog( 'Select the folder where you want to save the converted PNG files.', '~' );
        for ( i = 0; i < files.length; i++ )
        {
            sourceDoc = app.open(files[i], DocumentColorSpace.RGB); // returns the document object
            // Call function getNewName to get the name and file to save the pdf
            // targetFile = getNewName();
            // Call function getPNGOptions get the PNGExportOptions for the files
            // pngExportOpts = getPNGOptions();

            artboardToPNGs ();

            // Export as PNG
            // sourceDoc.exportFile( targetFile, ExportType.PNG24, pngExportOpts );
            sourceDoc.close(SaveOptions.DONOTSAVECHANGES);
        }
        alert( 'Files are saved as PNG in ' + destFolder );
    }
    else
    {
        alert( 'No matching files found' );
    }
}
 

/**
 * Get the new file name. The primary name is the same as the source file.
 */
function getNewName()
{
    var ext, docName, newName, saveInFile, docName;
    docName = sourceDoc.name;
    ext = '.png'; // new extension for png file
    newName = "";
    for ( var i = 0 ; docName[i] != "." ; i++ )
    {
        newName += docName[i];
    }
    newName += ext; // full png name of the file
    // Create a file object to save the png
    saveInFile = new File( destFolder + '/' + newName );
    return saveInFile;
}
 
function artboardToPNGs() {
	if ( parseFloat( app.version ) < 15 ) { return; }
	if ( app.documents.length == 0 ) { return; }
	// app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
	var idx, j, size, pngExport, doc, dF, artBds, abName, scale, pngFile, matches;
	size = 750 ;
	pngExport = getPNGOptions ();
	// pngExport = new ExportOptionsPNG24();
	// pngExport.matte = false;
	// pngExport.transparency = true;
	// pngExport.antiAliasing = true;
	// pngExport.artBoardClipping = true;
	// pngExport.saveAsHTML = false;
	// dF = Folder( Folder.desktop + "/AI Artboard PNG's" ); 
	// if ( !dF.exists ) dF.create();
	//doc = app.activeDocument;
	artBds = sourceDoc.artboards;
	idx = artBds.getActiveArtboardIndex();
	abName = artBds[ idx ].name;
	// nel fattore scala definisco di aumentare di un 30% la dimensione dell'immagine DXF da elaborare, 
	scale = ( size / ( artBds[ idx ].artboardRect[2] - artBds[ idx ].artboardRect[0] ) ) * 100 * 1.3; 
	//pngFile = File( dF.fsName + '/' + abName + '_00' + sizes[j] + 'x' + sizes[j] + '.png' );
	matches = sourceDoc.name.match (/([a-z0-9_\-\.]+)\.DXF$/i);
	pngFile = File (destFolder + '/' + matches[1] + '.png');

	pngExport.horizontalScale = pngExport.verticalScale = scale;
	sourceDoc.exportFile( pngFile, ExportType.PNG24 ,pngExport );
	// app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;
	// alert( 'All done…' );
};
 

/**
 * Set the PNG saving options of the files using the PDFSaveOptions object.
 */ 
function getPNGOptions()
{
    // PNG8
    /*
    var pngExportOpts = new ExportOptionsPNG8();
    pngExportOpts.antiAliasing = true;
    pngExportOpts.artBoardClipping = false; 
    pngExportOpts.saveAsHTML = false;
    pngExportOpts.transparency = true;
    return pngExportOpts;
    */
    
    // PNG24
    // Create the PDFSaveOptions object to set the PDF options
    var pngExportOpts = new ExportOptionsPNG24();
    // pngExportOpts.verticalScale = 416.667;
    // pngExportOpts.horizontalScale = 416.667;    
    // Setting PNGExportOptions properties. Please see the JavaScript Reference
    // for a description of these properties.
    // Add more properties here if you like
    pngExportOpts.antiAliasing = true;
    pngExportOpts.artBoardClipping = false;
    //pngExportOpts.horizontalScale = 100.0;
    //pngExportOpts.matte = true;
    //pngExportOpts.matteColor = 0, 0, 0;
    pngExportOpts.saveAsHTML = false;
    pngExportOpts.transparency = true;
    //pngExportOpts.verticalScale = 100.0;
    return pngExportOpts;
}
 