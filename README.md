# DXF2PNG8
This applications helps in making a batch conversion from files in DXF to PNG8.

The following tutorial apply only for owners of `Adobe Illustrator`.
The main issue in converting DXF is that all the construction lines need to be thick enough and the file as small as possible for an internet use.

Convert DXF to PNG24
--------------------
Copy the conversion plugin `ExportDXF2PNG24.jsx` to the folder `C:\Program Files\Adobe\Adobe Illustrator CC 2014\Presets\it_IT\Script`. 
Now when you open Illustrator, you can find the option `ExportDXF2PNG24` in `File/Script` menu.

For runnig the conversion:

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

	* File extensions
	* Source Folder 
	* Target Folder
	* Stroke increase

Convert PNG24 to PNG8
---------------------
For optimum conversion to PNG8 use the `pngquant` software on previous output folder:
	
	pngquant --speed 1 --verbose --ext new.png 4 *.png

Other sources
-------------
*	[Extending Fireworks CS5](http://help.adobe.com/en_US/fireworks/cs/extend/fireworks_cs5_extending.pdf)
*	[Illustrator CC scripting reference](http://wwwimages.adobe.com/content/dam/Adobe/en/devnet/pdf/illustrator/scripting/CC/Illustrator%20Scripting%20Reference%20-%20JavaScript.pdf)
*	[Pngquant](https://pngquant.org/)



