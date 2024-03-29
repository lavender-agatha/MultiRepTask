import { LabCanvasCommonShape, shape_defaults } from "./LabCanvasCommonShape.mjs";

export const aoi_defaults = {
    ...shape_defaults,
};

/**
 * 
 * Implements an area of interaction for the lab.js canvas
 * @extends LabCanvasCommonShape
 * 
 */
export class LabCanvasAreaOfInteraction extends LabCanvasCommonShape {

    /**
     * Constructs a new LabCanvasAreaOfInteraction
     * @param {string} label Area of Interaction label (mandatory)
     * @param {number} width Area of Interaction width (mandatory)
     * @param {number} height Area of Interaction height (mandatory)
     * @param {number} [left=0] The horizontal (x) position as in lab.js 
     *      coordinate system (default: 0, the canvas horizontal center)
     * @param {number} [top=0] The vertical (y) position as in lab.js 
     *      coordinate system (default: 0, the canvas vertical center)
     * @param {number} [angle=0] The inclination angle (default: 0, which 
     *      means a horizontally disposed shape)
     * @param {string} [id='aoi_'+label] The object id for identification 
     *      purposes (default: label prefixed by 'aoi_')
     * 
     */
    constructor (
        label, width, height, 
        left=undefined, top=undefined, angle=undefined, id=`aoi_${label}`
    ) {
        /* The fill color is not necessary outside lab.js builder, but it
            would be a lot of work to remove this property here and still
            inherit LabCanvasCommonShape, so we made it builder-compatible
            already! Also, this would be the only class using 
            LabCanvasCommonShape to not have a fill property, therefore
            totally inconvenient to remove its support.

            ^ RE: Above I just wasn't seeing a way to implement that. Now it
                is implemented and the fill color for the builder would not
                be defined. If implementing it becomes a need, there should
                be an addParameter setting the value and a lockProperty for it
                is fixed and should not be changed.
        */
        super(
            'aoi', false, aoi_defaults, null, width, height, 
            left, top, angle, undefined, id, false //not renderable
        );
        this.setMandatory(['label']);
        this.label = label;
    }

    FromTemplate(lcc, id=null) {
        if (lcc instanceof LabCanvasAreaOfInteraction) {
            return super.fromLabCanvasObjectTemplate(lcc, id);
        }
        else if (lcc instanceof LabCanvasCommonShape) {
            return this.fromLabComonCanvasShapeTemplate(lcc, id);
        }
        return super.FromTemplate(lcc, id);
    }

    fromLabComonCanvasShapeTemplate(ccs, id=null) {
        var naoi = new LabCanvasAreaOfInteraction(
            ccs.label ?? this.label ?? id ?? ccs.id, ccs.width, ccs.height,
            ccs.left, ccs.top, ccs.angle, id ?? ccs.id
        );

        return super.fromLabCanvasObjectTemplate(naoi, id);
    }
}

