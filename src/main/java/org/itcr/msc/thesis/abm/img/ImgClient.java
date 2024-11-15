package org.itcr.msc.thesis.abm.img;

import org.itcr.msc.thesis.abm.set.SetJava;
import org.itcr.msc.thesis.abm.utils.ExceptionHandler;
import org.json.JSONArray;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.geom.Path2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Set;

public class ImgClient {
    public static final Color transparent;

    static {
        transparent = new Color(255, 255, 255, 0);
    }
    private final String Baseline = "baseline";
    private ArrayList<ABMLayer> layers;
    private HashMap<String, ABMLayer> layersNames;
    private int envScale;
    private int wPixels;
    private int hPixels;
    private BufferedImage patches;
    private BufferedImage finalImg;
    private boolean horizontalLimit;
    private boolean verticalLimit;
    private boolean seamless;

    private final SpriteManager spriteManager;
    private final HashMap<Integer,Stroke> strokes;

    public ImgClient() {
        spriteManager = new SpriteManager();
        strokes=new HashMap<>();
    }

    public void setLimits(boolean horizontalLimit, boolean verticalLimit) {
        this.horizontalLimit = horizontalLimit;
        this.verticalLimit = verticalLimit;
    }

    public void setSeamless(boolean seamless) {
        this.seamless = seamless;
    }

    public void setLayers(String layersName) {
        layers = new ArrayList<>();
        layersNames = new HashMap<>();
        JSONArray jsonLayers = new JSONArray(layersName);
        int len = jsonLayers.length();
        for (int i = 0; i < len; ++i) {
            ABMLayer layer = new ABMLayer();
            layersNames.put(jsonLayers.getString(i), layer);
            layers.add(layer);
        }
    }


    public void newImg(int envScale, int width, int height) {
        this.envScale = envScale;
        if (width != this.wPixels || height != this.hPixels) {
            patches = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
            for (ABMLayer layer : layers) {
                layer.image = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
                layer.used = false;
            }
            finalImg = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        } else {
            for (ABMLayer layer : layers) {
                Graphics2D g2d = (Graphics2D) layer.image.getGraphics();
                g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.CLEAR));
                g2d.setColor(transparent);
                g2d.fillRect(0, 0, width, height);
                g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER));
                layer.used = false;
            }
            Graphics2D g2d = (Graphics2D) patches.getGraphics();
            g2d.setColor(Color.WHITE);
            g2d.fillRect(0, 0, width, height);
        }
        this.wPixels = width;
        this.hPixels = height;
    }

    public BufferedImage getImg() {
        Graphics2D g2d = (Graphics2D) finalImg.getGraphics();
        g2d.drawImage(patches, 0, 0, null);
        for (ABMLayer layer : layers) {
            if (layer.used) {
                g2d.drawImage(layer.image, 0, 0, null);
            }
        }
        return finalImg;
    }

    public Graphics2D patches() {
        return (Graphics2D) patches.getGraphics();
    }

    public Graphics2D layer(String layerName) {

        return layersNames.get(layerName).getGraphics();
    }


    public byte[] getImg(String format) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(getImg(), format, baos);
        return baos.toByteArray();
    }

    public byte[] asJPEG() throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(getImg(), "jpeg", baos);
        return baos.toByteArray();
    }

    public byte[] asPNG() throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(getImg(), "png", baos);
        return baos.toByteArray();
    }

    /**
     * List of known shapes by the img client
     *
     * @return
     */
    public SetJava knownShapes() {
        return new SetJava((Set) spriteManager.getShapes());
    }

    public Color namedColor(String name) {
        try {
            return (Color) Color.class.getField(name).get(null);
        } catch (Exception e) {
            ExceptionHandler.handleException(e);
            return null;
        }
    }

    public void drawString(AgentDrawingData data, String text, double xPixelD,double yPixelD) {
        int xPixel = (int)xPixelD;
        int yPixel = (int)yPixelD;
        Graphics2D g2d = layer(data.layer);
        g2d.setColor(data.color);
        g2d.setFont(data.font);
        g2d.drawString(text, xPixel, yPixel);
    }

    public void drawAgent(AgentDrawingData agentData, double xPixelD, double yPixelD) {
        int xPixel = (int)xPixelD;
        int yPixel = (int)yPixelD;
        SpriteData spriteData = spriteManager.getSprite
                (agentData.shape, Math.max(1, (int) (agentData.size * envScale)), agentData.angle);
        Graphics2D g2d = layer(agentData.layer);
        xPixel -= spriteData.wHalf;
        yPixel -= spriteData.hHalf;
        g2d.drawImage(spriteData.get(agentData.color), xPixel, yPixel, null);
        if (agentData.label!= null && !agentData.label.isEmpty()){
            g2d.setColor(agentData.color);
            g2d.setFont(agentData.font);
            int pixelH = yPixel+spriteData.hHalf+agentData.font.getSize()/2;
            g2d.drawString(agentData.label, xPixel+spriteData.w,pixelH );
            if (!horizontalLimit && seamless){
                g2d.drawString(agentData.label, xPixel+spriteData.w-wPixels, pixelH);
            }
        }

        int nextX = 0;
        if (!horizontalLimit && seamless) {
            if (xPixel < 0) {
                nextX = xPixel + wPixels;
                g2d.drawImage(spriteData.get(agentData.color), nextX, yPixel, null);
            } else if (xPixel + spriteData.w > wPixels) {
                nextX = xPixel - wPixels;
                g2d.drawImage(spriteData.get(agentData.color), nextX, yPixel, null);
            }
        }
        if (!verticalLimit && seamless) {
            if (yPixel < 0) {
                int nextY = yPixel + hPixels;
                g2d.drawImage(spriteData.get(agentData.color), xPixel, nextY, null);
                if (nextX != 0) {
                    g2d.drawImage(spriteData.get(agentData.color), nextX, nextY, null);
                }
            } else if (yPixel + spriteData.h > hPixels) {
                int nextY = yPixel - hPixels;
                g2d.drawImage(spriteData.get(agentData.color), xPixel, nextY, null);
                if (nextX != 0) {
                    g2d.drawImage(spriteData.get(agentData.color), nextX, nextY, null);
                }
            }
        }
    }

    public void drawStroke(String layer, Color color, BasicStroke width, Double[] pts) {
        Graphics2D g2d = layer(layer);
        g2d.setColor(color);
        g2d.setStroke(width);
        int x1 = pts[0].intValue();
        int y1 = pts[1].intValue();
        int x2 = pts[2].intValue();
        int y2 = pts[3].intValue();

        g2d.drawLine(x1, y1, x2, y2);
        int nextX1 = 0;
        int nextX2 = 0;
        if (!horizontalLimit) {
            if ( x1 < 0) {
                nextX1 = x1 + wPixels;
                nextX2 = x2 + wPixels;
                g2d.drawLine(nextX1, y1, nextX2, y2);
            }else {
                if (x2 > wPixels) {
                    nextX1 = x1 - wPixels;
                    nextX2 = x2 - wPixels;
                    g2d.drawLine(nextX1, y1, nextX2, y2);
                }
            }
        }
        if ( y2 < y1) {
            int temp = y1;
            y1 = y2;
            y2 = temp;
            temp = x1;
            x1 = x2;
            x2 = temp;
            temp = nextX1;
            nextX1 = nextX2;
            nextX2 = temp;
        }
        if (!verticalLimit) {
            if ( y1 < 0) {
                int nextY1 = y1 + hPixels;
                int nextY2 = y2 + hPixels;
                g2d.drawLine(x1, nextY1, x2, nextY2);
                if (nextX1 != 0) {
                    g2d.drawLine(nextX1, nextY1, nextX2, nextY2);
                }
            }else {
                if (y2 > hPixels) {
                    int nextY1 = y1 - hPixels;
                    int nextY2 = y2 - hPixels;
                    g2d.drawLine(x1, nextY1, x2, nextY2);
                    if (nextX1 != 0) {
                        g2d.drawLine(nextX1, nextY1, nextX2, nextY2);
                    }
                }
            }
        }
    }

    public Stroke createStroke(int width) {
        if (!strokes.containsKey(width)) {
            strokes.put(width, new BasicStroke(width));

        }
        return strokes.get(width);
    }

    public String asRGB(Color color) {
        return "#" + Integer.toHexString(color.getRGB()).substring(2);
    }

    public String asRGBA(Color color) {
        return "#" + Integer.toHexString(color.getRGB()).substring(2) + Integer.toHexString(color.getAlpha());
    }

    public String[] namedColors() {
        return new String[]{
                "red", "green", "blue", "yellow", "black", "darkGray", "pink", "lightGray", "orange",
                "magenta", "cyan", "white", "gray"};
    }

    public Color rgbColor(int r, int g, int b) {
        return new Color(r, g, b);
    }

    public Color rgbaColor(int r, int g, int b, int a) {
        return new Color(r, g, b, a);
    }

    public AgentDrawingData createAgentDrawingData() {
        return new AgentDrawingData(Baseline, "circle", 1, 0, Color.black);
    }

    public AgentDrawingData createArrow(Font font,String layer,double angle,Color color,double size){
        AgentDrawingData agentDrawingData= new AgentDrawingData(layer, "delta",size, angle, color);
        agentDrawingData.font = font;
        return agentDrawingData;
    }

    public Path2D.Double createPath() {
        Path2D.Double delta = new Path2D.Double();
        return delta;
    }

    public void addShape(String name, Shape shape) {
        spriteManager.addShape(name, shape);
    }
}
