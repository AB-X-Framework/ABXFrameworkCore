package org.abx.core;

import java.util.ArrayList;

public interface ABMListener {
    /**
     * If someone request a print inside the ABM
     */
    void print(String msg);

    void clear();

    /**
     * The current step number has changed
     *
     * @param stepId the new step
     */
    void currStep(int stepId);

    /**
     * Indicate when there is an error
     * @param ex the error to handle
     */
    void handleError(Throwable ex);

    /**
     * When testing is done
     * @param success total test cases successfully executed
     * @param failures total test cases failed
     */
    void testingComplete(int success, int failures);

    /**
     * A new chart is added
     * @param chartName the chart name
     */
    void chartAdded(String chartName);

    /**
     * A new scale has been requested
     * @param scale the scale
     */
    void scaleUpdated(int scale);

    /**
     * The layer list has being updated
     * @param layerNames the layers names
     */
    void layersUpdated(String layerNames);

    /**
     * The simulation status has been updated
     * @param status the new status
     */
    void simulationStatusUpdated(String status);
}
