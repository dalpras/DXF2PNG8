# DXF2PNG8
This applications helps in making a batch conversion from files in DXF to PNG8.

The following tutorial apply only for owners of `Adobe Illustrator` and `Adobe Fireworks`.
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

3. Run the script

Convert PNG24 to PNG8
---------------------
Once converted with illustrator, the photos need to be reprocessed in PNG8 to bring them to the proper size, in greyscale, with the right shade of gray.

Copy the script `EnhanceBorder.jsf` to folder `C:\Program Files (x86)\Adobe\Adobe Fireworks CS6\Configuration\Commands\Batch Commands`.

Now for having a PNG8 optimized file: 

1. Open the folder with the PNG24 photos in Windows Explorer, sort photos by size and remove the photos that may exceed a proper size that could give errors during conversion.

2. Browse the folder that contains the PNG24 photos with Adobe Bridge.

3. Select batch conversion in `Adobe Fireworks` (File / Batch Processing), and enter the followings batch commands: 
    
    * Convert to Greyscale
    * DarkenBorder.jsf
    * Scale: "Scale to Fit Area" and set the size as desired 
      (for my own files: `2DIMAGEREAR` and `3DIMAGE` to 975x549px; `2DIMAGESIZE` to 986x555px)
    * Export: select `Custom format` (PNG 8, grayscale, 32 shades of gray)
 
4. Run the script

Other sources
-------------
*	[Extending Fireworks CS5](http://help.adobe.com/en_US/fireworks/cs/extend/fireworks_cs5_extending.pdf)
*	[Illustrator CC scripting reference](http://wwwimages.adobe.com/content/dam/Adobe/en/devnet/pdf/illustrator/scripting/CC/Illustrator%20Scripting%20Reference%20-%20JavaScript.pdf)



