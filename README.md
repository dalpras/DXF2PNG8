# DXF2PNG8
This applications make the best conversion possible from DXF to PNG8.

The following tutorial apply only for owners of `Adobe Illustrator`.
I tried many solutions: Kabeja, Inkscape with Gcode, Dia, LibreOffice. None of these software keep all informations of the original DXF file. 

Only Illustrator is able to keep all the information in particular when dealing with drawing dimensions.
Illustrator has also some defects: the main issue in converting DXF is that many construction lines are not thick enough, thats why is better to apply a stroke to inner lines
without altering dimensions.
Furthermore when dealing with web, files need to be small as possible: `pngquant` is far better than Illustrator in PNG24 to PNG8 conversion.

Convert DXF to PNG24
--------------------
Copy the conversion plugin `ExportDXF2PNG24.jsx` to the folder `C:\Program Files\Adobe\Adobe Illustrator CC 2014\Presets\it_IT\Script`. 
Now when you open Illustrator, you can find the option `ExportDXF2PNG24` in `File/Script` menu.

For running the conversion:

1. Open Illustrator.
2. Create a new Document with these parameters:
   
   * Size: 1920 x 1080 px
   * Colour Space: RGB
   * Raster Effects: Video
    
   **Please Note**: the real image size doesn't depend on sheet size, but by the scale multiplier that has been used within the conversion script.

2. Open a file to be converted and set:

    * Fit to drawing sheet;
    * Combine levels.

3. Run the script `File/Script/ExportDXF2PNG24` and supply asked parameters:

	* Source Folder 
	* File extensions
	* Stroke increase
	* Target Folder

4.	Wait until script has finished.

Convert PNG24 to PNG8
---------------------
For optimum conversion to PNG8 use the `pngquant` software on previous output folder:
	
	pngquant --speed 1 --verbose --ext new.png 4 *.png

Other sources
-------------
*	[John's Scripts  4  Adobe Illustrator](http://www.wundes.com/JS4AI/)
*	[Illustrator CC scripting reference](http://wwwimages.adobe.com/content/dam/Adobe/en/devnet/pdf/illustrator/scripting/CC/Illustrator%20Scripting%20Reference%20-%20JavaScript.pdf)
*	[Pngquant](https://pngquant.org/)



