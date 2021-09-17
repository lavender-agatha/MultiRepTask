import { LabCanvasRectangle, rect_defaults } from "./LabCanvasRectangle.mjs";

export class LabCanvasSquare extends LabCanvasRectangle {
    constructor(
        dimension, left=rect_defaults.left, top=rect_defaults.top, 
        angle=rect_defaults.angle, fill=rect_defaults.fill, id=rect_defaults.id
    ) {
        super(dimension, dimension, left, top, angle, fill, id);
        this.setMandatory(["dimension"]);
        this.addEquivalence(null, ['dimension', 'height', 'width']);
        this.dimension = dimension;
    }
}