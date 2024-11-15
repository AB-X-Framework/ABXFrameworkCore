package org.abx.core;

import com.Ostermiller.util.CSVPrinter;
import org.graalvm.collections.Pair;
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Source;
import org.graalvm.polyglot.Value;
import org.itcr.msc.thesis.abm.bag.BagUtils;
import org.itcr.msc.thesis.abm.data.NormalGenerator;
import org.itcr.msc.thesis.abm.framework.GridJava;
import org.itcr.msc.thesis.abm.img.ImgClient;
import org.itcr.msc.thesis.abm.math.Complex;
import org.itcr.msc.thesis.abm.math.MersenneTwisterFast;
import org.itcr.msc.thesis.abm.net.ABMHttpClient;
import org.itcr.msc.thesis.abm.set.SetUtils;
import org.itcr.msc.thesis.abm.syntax.OptimizationLevel;
import org.itcr.msc.thesis.abm.syntax.SyntaxUtil;
import org.itcr.msc.thesis.abm.utils.StreamUtils;
import org.jcodec.api.SequenceEncoder;
import org.jcodec.common.model.ColorSpace;
import org.jcodec.scale.AWTUtil;
import org.junit.jupiter.api.Assertions;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.Stack;

public class ABMFrameworkCore implements ABMListener {
    private final static String Script = "{script}";

    private long tick;
    private SequenceEncoder enc;


    private final Stack<String> filePaths;
    private final OptimizationLevel optimizationLevel;
    private final HashSet<ABMListener> listeners;
    private final Context cx;

    //-----------------\\
    //- Setup section -\\
    //-----------------\\

    /**
     * Default constructor which all required JS
     *
     * @param optimizationLevel
     * @throws Exception
     */
    public ABMFrameworkCore(OptimizationLevel optimizationLevel) throws Exception {
        tick = System.currentTimeMillis();
        this.optimizationLevel = optimizationLevel;
        listeners = new HashSet<>();
        cx = Context.newBuilder("js").allowExperimentalOptions(true).option("js.operator-overloading", "true")
                .allowAllAccess(true)
                .build();
        cx.enter();
        Value jsBindings = cx.getBindings("js");
        jsBindings.putMember("SetUtils", new SetUtils());
        jsBindings.putMember("BagUtils", new BagUtils());
        jsBindings.putMember("imgClient", new ImgClient());
        MersenneTwisterFast rnd = new MersenneTwisterFast();
        jsBindings.putMember("normalGen", new NormalGenerator(rnd));
        jsBindings.putMember("rnd", rnd);

        jsBindings.putMember("ABMFrameworkCore", this);
        jsBindings.putMember("Assertions", Assertions.class);
        jsBindings.putMember("ComplexUtils", Complex.class);
        cx.leave();
        processResource("org/itcr/msc/thesis/abm/set/BagWrapper.js");
        processResource("org/itcr/msc/thesis/abm/set/SetWrapper.js");
        processResource("org/itcr/msc/thesis/abm/set/ListWrapper.js");
        processResource("org/itcr/msc/thesis/abm/utils/Utils.js");
        processResource("org/itcr/msc/thesis/abm/utils/Tests.js");
        cx.enter();
        SyntaxUtil.setup(cx);
        cx.leave();
        processResource("org/itcr/msc/thesis/abm/utils/Globals.js");
        processResource("org/itcr/msc/thesis/abm/units/UnitSystem.js");
        processResource("org/itcr/msc/thesis/abm/units/Distance.js");
        processResource("org/itcr/msc/thesis/abm/units/Angle.js");
        processResource("org/itcr/msc/thesis/abm/units/Time.js");
        processResource("org/itcr/msc/thesis/abm/math/ComplexWrapper.js");
        processResource("org/itcr/msc/thesis/abm/framework/ABMPen.js");
        processResource("org/itcr/msc/thesis/abm/framework/ABMEntity.js");
        processResource("org/itcr/msc/thesis/abm/framework/ABMRelation.js");
        processResource("org/itcr/msc/thesis/abm/framework/ABMPatch.js");
        processResource("org/itcr/msc/thesis/abm/framework/ABMAgent.js");
        processResource("org/itcr/msc/thesis/abm/framework/ABMVertex.js");
        processResource("org/itcr/msc/thesis/abm/framework/ABMEdge.js");
        processResource("org/itcr/msc/thesis/abm/framework/ABMStroke.js");
        processResource("org/itcr/msc/thesis/abm/framework/ABMChartSeries.js");
        processResource("org/itcr/msc/thesis/abm/framework/ABMTimeChart.js");
        processResource("org/itcr/msc/thesis/abm/framework/ABMHistogram.js");
        processResource("org/itcr/msc/thesis/abm/framework/ABMChart.js");
        processResource("org/itcr/msc/thesis/abm/framework/ABMEnv.js");
        processResource("org/itcr/msc/thesis/abm/framework/ABMGrid.js");


        filePaths = new Stack<>();
    }

    /**
     * Trigger message to listeners to tell them setup was done
     */
    public void setupReady() {
        simulationStatusUpdated("No Env");
    }

    //------------------------\\
    //- JS execution section -\\
    //------------------------\\

    /**
     * Evaluates a string
     *
     * @param source the source to be evaluated
     * @throws Exception if JS error happens
     */
    public Value eval(Source source) throws Exception {
        try {
            cx.enter();
            return cx.eval(source);
        } catch (Throwable e) {
            e.printStackTrace();
            if (e.getMessage()==null){
                handleError(e);
                throw e;
            }
            Exception newEx = new Exception(SyntaxUtil.postprocess(e.getMessage()));
            newEx.setStackTrace(e.getStackTrace());
            handleError(newEx);
            throw newEx;
        } finally {
            cx.leave();
        }
    }

    /**
     * Process the JS with a name
     *
     * @param content the JS content
     * @param name    the name of the JS file
     * @return The value to be returned
     * @throws Exception If there is a JS exception
     */
    public Value process(String content, String name) throws Exception {
        return eval(Source.newBuilder("js", SyntaxUtil.preprocess(content, optimizationLevel), name).build());
    }

    /**
     * Push the desired path
     *
     * @param path    The desired path
     * @param content the JS content
     * @param name    the name of the JS file
     * @return the content of the JS file
     * @throws Exception If the JS throws an exception
     */
    @SuppressWarnings("UnusedReturnValue")
    public Value process(String path, String content, String name) throws Exception {
        filePaths.push(path);
        Value output = eval(Source.newBuilder("js", SyntaxUtil.preprocess(content, optimizationLevel), name).build());
        filePaths.pop();
        return output;
    }

    /**
     * Process internal JS file
     *
     * @param resource
     * @throws Exception
     */
    public void processResource(String resource) throws Exception {
        String name = resource.substring(resource.lastIndexOf("/") + 1);
        process(StreamUtils.readResource(resource), name);
    }

    /**
     * Process js file
     *
     * @param filename
     * @throws Exception
     */
    public void processFile(String filename) throws Exception {
        if (filename.startsWith(Script)) {
            filename = filename.substring(Script.length());
            filename = new File(filePaths.peek()).getParent() + filename;
        }
        filePaths.push(filename);
        String name = new File(filename).getName();
        process(StreamUtils.readStream(new FileInputStream(filename)), name);
        filePaths.pop();
    }


    //---------------------\\
    //- Resources section -\\
    //---------------------\\
    private String absFile(String filename) {
        if (filename.startsWith(Script)) {
            filename = filename.substring(Script.length());
            filename = new File(filePaths.peek()).getParent() + filename;
        }
        return filename;
    }

    /**
     * Reads binary data from a file
     *
     * @param filename the file name can use {script}/
     * @return the binary data
     * @throws Exception if File cannot be read
     */
    public byte[] readBinary(String filename) throws Exception {
        filename = absFile(filename);
        File file = new File(filename);
        return StreamUtils.readByteArrayStream(new FileInputStream(file));
    }

    /**
     * Reads a string from the file
     *
     * @param filename filename the file name can use {script}/
     * @return the String content
     * @throws Exception if filename cannot be read
     */
    public String readString(String filename) throws Exception {
        return new String(readBinary(filename));
    }

    /**
     * Writes a img
     *
     * @param filename the filename can use the {script}/
     * @param content  the content of data to be saved
     * @throws Exception
     */
    public void writeBinary(String filename, byte[] content) throws Exception {
        filename = absFile(filename);
        File file = new File(filename);
        FileOutputStream fos = new FileOutputStream(file);
        fos.write(content);
        fos.close();
    }

    /**
     * Writes a buffered image to the file system
     *
     * @param filename the filename can use the {script}/
     * @param img      the image to be written
     * @throws Exception
     */
    public void writeImg(String filename, BufferedImage img) throws Exception {
        filename = absFile(filename);
        String extension = filename.substring(filename.lastIndexOf(".") + 1);
        ImageIO.write(img, extension, new File(filename));
    }

    /**
     * Writes content to file
     *
     * @param filename the filename can use the {script}/
     * @param content  the content to be written
     * @throws Exception
     */
    public void writeString(String filename, String content) throws Exception {
        writeBinary(filename, content.getBytes());
    }

    public void appendString(String filename, String content)throws Exception {
        filename = absFile(filename);
        File file = new File(filename);
        FileOutputStream fos = new FileOutputStream(file, true);
        fos.write(content.getBytes("UTF-8"));
        fos.close();
    }

    /**
     * Gets input stream from file
     *
     * @param filename
     * @return
     * @throws FileNotFoundException
     */
    public InputStream streamFile(String filename) throws FileNotFoundException {
        if (filename.startsWith(Script)) {
            filename = filename.substring(Script.length());
            filename = new File(filePaths.peek()).getParent() + filename;
        }
        return new FileInputStream(filename);
    }

    //-----------------------\\
    //- Img & Video section -\\
    //-----------------------\\

    /**
     * Img
     *
     * @param videoFilename
     * @param fps
     * @throws Exception
     */
    public void startVideoRecording(String videoFilename, String fps) throws Exception {
        videoFilename = absFile(videoFilename);
        File output = new File(videoFilename);
        switch (fps) {
            case "24": {
                enc = SequenceEncoder.create24Fps(output);
                break;
            }
            case "30": {
                enc = SequenceEncoder.create30Fps(output);
                break;
            }
            case "29.97": {
                enc = SequenceEncoder.create2997Fps(output);
                break;
            }
        }
    }

    /**
     * Appends img to video stream
     *
     * @param img
     * @throws Exception
     */
    public void appendImg(BufferedImage img) throws Exception {
        enc.encodeNativeFrame(AWTUtil.fromBufferedImage(img, ColorSpace.RGB));
    }

    /**
     * Closes video stream
     *
     * @throws Exception
     */
    public void closeVideoStream() throws Exception {
        enc.finish();
    }


    /**
     * Tells all listeners to print message
     *
     * @param message
     */
    public void print(String message) {
        for (ABMListener listener : listeners) {
            listener.print(message);
        }
    }

    /**
     * Handles errors
     *
     * @param e the error to handle
     */
    public void handleError(Throwable e) {
        for (ABMListener listener : listeners) {
            listener.handleError(e);
        }
    }

    /**
     * Tells all listeners to clear messages
     */
    public void clear() {
        for (ABMListener listener : listeners) {
            listener.clear();
        }
    }

    /**
     * Tells all listeners the results of test
     *
     * @param success  total test cases successfully executed
     * @param failures total test cases failed
     */
    public void testingComplete(int success, int failures) {
        for (ABMListener listener : listeners) {
            listener.testingComplete(success, failures);
        }
    }

    /**
     * Tells all listeners the current step
     *
     * @param stepId the new step
     */
    public void currStep(int stepId) {
        for (ABMListener listener : listeners) {
            listener.currStep(stepId);
        }
    }

    /**
     * Tells all listeners a new chart has arrived
     *
     * @param name the chart name
     */
    public void chartAdded(String name) {
        for (ABMListener listener : listeners) {
            listener.chartAdded(name);
        }
    }

    /**
     * Tells all listeners to request new scale
     *
     * @param scale the scale
     */
    @Override
    public void scaleUpdated(int scale) {
        for (ABMListener listener : listeners) {
            listener.scaleUpdated(scale);
        }
    }

    /**
     * Adds listener
     *
     * @param listener
     * @return
     */
    public ABMFrameworkCore addListener(ABMListener listener) {
        listeners.add(listener);
        return this;
    }

    /**
     * Remove listeners
     */
    public void teardown() {
        listeners.clear();
    }

    /**
     * Tells all listeners the list (JSON.stringified) of layers
     *
     * @param layerNames the layers names
     */
    public void layersUpdated(String layerNames) {
        for (ABMListener listener : listeners) {
            listener.layersUpdated(layerNames);
        }
    }

    /**
     * The simulation status has been updated
     *
     * @param status the new status
     */
    public void simulationStatusUpdated(String status) {
        for (ABMListener listener : listeners) {
            listener.simulationStatusUpdated(status);
        }
    }

    //-------------------------------\\
    //- Data transformation section -\\
    //-------------------------------\\

    /**
     * Writes a csv string from string matrix
     *
     * @param data
     * @return
     * @throws Exception
     */
    public String csvToString(String[][] data) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        new CSVPrinter(baos).println(data);
        String res = baos.toString();
        return res;
    }

    /**
     * Returns a string matrix from csv content
     *
     * @param content
     * @return
     */
    public String[][] toCSV(String content) {
        return com.Ostermiller.util.CSVParser.parse(content);
    }

    /**
     * Return image from byte array
     *
     * @param data
     * @return
     * @throws IOException
     */
    public BufferedImage toImg(byte[] data) throws IOException {
        return ImageIO.read(new ByteArrayInputStream(data));
    }

    /**
     * Byte array from string
     *
     * @param content the original string
     * @return
     * @throws UnsupportedEncodingException
     */
    public byte[] getBytes(String content) throws UnsupportedEncodingException {
        return content.getBytes(StandardCharsets.UTF_8);
    }

    //-----------------\\
    //- Utils section -\\
    //-----------------\\

    /**
     * Sleeps some milliseconds
     *
     * @param time
     * @throws Exception
     */
    public void sleep(int time) throws Exception {
        Thread.sleep(time);
    }

    /**
     * Creates a http client
     *
     * @return
     */
    public ABMHttpClient createHttpClient() {
        return new ABMHttpClient();
    }

    /**
     * <Filename, Formatted time>
     *
     * @return
     */
    public  String tick() {
        long newTime = System.currentTimeMillis();
        long result = newTime - tick;
        tick = newTime;
        int rem = (int) (result % 1000);
        result /= 1000;
        String tickString = "";
        if (rem > 0) {
            tickString = " " + rem + "ms";
        }
        rem = (int) (result % 60);
        result /= 60;
        if (rem > 0) {
            tickString = " " + rem + "s" + tickString;
        }
        if (result > 0) {
            tickString = result + "m" + tickString;
        }
        return tickString;
    }

    public GridJava createGrid(int w, int h, boolean horizontalLimit, boolean verticalLimit){
        return new GridJava(w,h,horizontalLimit,verticalLimit);
    }
}
