package org.abx.core.img;

import java.awt.*;
import java.awt.geom.AffineTransform;
import java.awt.geom.Arc2D;
import java.awt.geom.Path2D;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.util.HashMap;
import java.util.Set;

public class SpriteManager {
    public final static int AntiAliasing = 8;
    /**
     * First by name, second by scale
     */
    private HashMap<String, HashMap<Integer, SpritesData>> sprites;
    private HashMap<String, Shape> shapes;

    public SpriteManager() {
        sprites = new HashMap<>();
        shapes = new HashMap<>();
        addShape("circle", new Arc2D.Double(0, 0, 1, 1, 0, 360, Arc2D.CHORD));
        addShape("square", new Rectangle2D.Double(0, 0, 1, 1));
        Path2D.Double triangle = new Path2D.Double();
        triangle.moveTo(0, 0);
        triangle.lineTo(1, 0.5);
        triangle.lineTo(0, 1);
        addShape("triangle",triangle);
        Path2D.Double delta = new Path2D.Double();
        delta.moveTo(0, 0.1);
        delta.lineTo(1, 0.5);
        delta.lineTo(0, 0.9);
        delta.lineTo(0.2, 0.5);
        addShape("delta",delta);
    }

    public void addShape(String name, Shape shape) {
        shapes.put(name, shape);
        sprites.put(name, new HashMap<>());
    }

    public Set<String> getShapes(){
        return shapes.keySet();
    }


    public SpriteData getSprite(String shape, int scale, double angle) {
        HashMap<Integer, SpritesData> sprite = sprites.get(shape);
        if (!sprite.containsKey(scale)) {
            sprite.put(scale, createSpriteData(shape, scale*AntiAliasing));
        }
        SpritesData spritesData = sprite.get(scale);
        return spritesData.get(angle);
    }

    private SpritesData createSpriteData(String name, int scale) {
        BufferedImage img = new BufferedImage(scale, scale, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2d = (Graphics2D) img.getGraphics();
        g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.CLEAR));
        g2d.setColor(ImgClient.transparent);
        g2d.fillRect(0, 0, scale,scale);
        g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER));

        Shape shape = shapes.get(name);
        AffineTransform tx = new AffineTransform();
        tx.scale(scale, scale);
        Shape newShape = tx.createTransformedShape(shape);
        g2d.setColor(Color.white);
        g2d.setBackground(Color.white);
        g2d.fill(newShape);
        return new SpritesData(img, 48);
    }
}
