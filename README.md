# DXF2PNG8
This applications make the best conversion possible from DXF to PNG8 with Adobe Illustrator.

The following tutorial apply only for owners of `Adobe Illustrator`.
I tried many solutions: Kabeja, Inkscape with Gcode, Dia, LibreOffice. None of these software keep all informations of the original DXF file. 

Only Illustrator is able to keep all the information in particular when dealing with drawing dimensions.
Illustrator has also some defects: the main issue in converting DXF is that many construction lines are not thick enough, thats why is better to apply a stroke to inner lines
without altering dimensions.
Furthermore when dealing with web, files need to be small as possible: `pngquant` is far better than Illustrator in PNG24 to PNG8 conversion.

Convert DXF to PNG24
--------------------
For starting the conversion just double click on the script and Illustrator will start asking: 
	* Source Folder 
	* File extensions
	* Stroke increase
	* Target Folder

For making available the script into Illustrator, just copy the plugin `ExportDXF2PNG24.jsx` into the folder `C:\Program Files\Adobe\Adobe Illustrator CC 2014\Presets\it_IT\Script`. 
Now when you open Illustrator, you can find the option `ExportDXF2PNG24` in `File/Script` menu.

Convert PNG24 to PNG8
---------------------
For optimum conversion to PNG8 use the `pngquant` software on previous output folder:
	
	pngquant --speed 1 --verbose --ext new.png 4 *.png

Other sources
-------------
*	[Illustrator CC scripting reference](http://wwwimages.adobe.com/content/dam/Adobe/en/devnet/pdf/illustrator/scripting/CC/Illustrator%20Scripting%20Reference%20-%20JavaScript.pdf)
*	[Append to an existing text file using Photoshop Scripting](http://stackoverflow.com/questions/18240838/append-to-an-existing-text-file-using-photoshop-scripting-jsx)
*	[John's Scripts  4  Adobe Illustrator](http://www.wundes.com/JS4AI/)
*	[Welcome to the extendscript.wiki!](https://github.com/ExtendScript/wiki/wiki)
*	[Pngquant](https://pngquant.org/)



