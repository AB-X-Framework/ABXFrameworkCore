package org.itcr.msc.thesis.abm;

import java.util.ArrayList;

public class ConsoleABMListener implements ABMListener {
    @Override
    public void print(String value) {
        System.out.print(value);
    }

    /**
     * Request output to be cleared
     */
    @Override
    public void clear() {
        System.out.println();
    }

    /**
     * Request curr step to be updated
     * @param currStep the current step
     */
    @Override
    public void currStep(int currStep) {
        System.out.println("Curr Step "+currStep);
    }

    /**
     * Indicate when there is an error
     * @param ex the error to handle
     */
    @Override
    public void handleError(Throwable ex) {
        ex.printStackTrace(System.out);
    }

    /**
     * When testing is done
     * @param success total test cases successfully executed
     * @param failures total test cases failed
     */
    @Override
    public void testingComplete(int success, int failures) {
        System.out.println("Testing complete. Success: " + success + " Failures: " + failures);
    }

    /**
     * A new chart is added
     * @param chartName the chart name
     */
    @Override
    public void chartAdded(String chartName) {
        System.out.println("Chart added: " + chartName);
    }

    /**
     * A new scale has been requested
     * @param scale the scale
     */
    @Override
    public void scaleUpdated(int scale) {
        System.out.println("Set scale to " + scale);
    }

    /**
     * The layer list has been upated
     * @param layerNames the layers name
     */
    @Override
    public void layersUpdated(String layerNames) {
        System.out.println("Layers updates " + layerNames);
    }

    /**
     * The simulation status has been updated
     * @param status the new status
     */
    public void simulationStatusUpdated(String status) {
        System.out.println("Simulation status: " + status);
    }
}
