CONVERSIONE DXF IN PNG
======================

Applicazione del plugin di conversione a PNG24
----------------------------------------------

Copiare il plugin di conversione ExportDXF2PNG24.jsx nella cartella di Illustrator 
C:\Program Files\Adobe\Adobe Illustrator CC 2014\Presets\it_IT\Script

All'avvio di Illustrator il comando **ExportDXF2PNG24** è disponibile nel menu File/Script.

1. Creare un nuovo documento con i parametri seguenti:

    * Dimensione: 1920x1080px

    * Metodo colore: RGB

    * Effetti raster: Video
    
    **Nota**: la vera dimensione del file non dipende dalla dimensione del foglio, ma dal moltiplicatore di scala che è stato usato all'interno del file di conversione.

2. Aprire manualmente un file da convertire e settare:

    * Adatta a tavola di disegno;
    * Combina livelli.

3. Eseguire il comando per effettuare la conversione tra DWG/DXF e PNG32.


Livellamento foto PNG24 a PNG8
------------------------------

Una volta convertite le foto con illustrator. Queste vanno riprocessate per portarle a PNG8 alla dimensione corretta, in greyscale, con la giusta tonalità di grigi.
Copiare il comando Batch "EnhanceBorder.jsf" nella cartella 
_C:\Program Files (x86)\Adobe\Adobe Fireworks CS6\Configuration\Commands\Batch Commands_

A questo punto per convertire a PNG corretto:

1. Aprire la cartella con le foto PNG24 da Windows Explorer, ordinare le foto per dimensione e rimuovere  le foto eccessivamente grandi che potrebbero dare errori durante la conversione.

2. Aprire la cartella con le foto PNG24 da convertire in Adobe Bridge.

3. Selezionare la conversione in batch di Fireworks (File > Elaborazione batch), ed inserire nei comandi i seguenti batch:
    
    * Convert to Greyscale
    
    * DarkenBorder.jsf

    * Scale: "scala per contenere area" e impostarlo su un box di dimensione massima di:        
    
        * __2DIMAGEREAR__: 975 x 549px
        
        * __2DIMAGESIZE__: 986 x 555px 
        
        * __3DIMAGE__: 975 x 549px

    * Export: selezionare formato personalizzato (PNG8, greyscale, 32 toni di grigio)
 
4. Eseguire il batch.
