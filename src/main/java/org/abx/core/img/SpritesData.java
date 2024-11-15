package org.abx.core.img;

import java.awt.*;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.util.ArrayList;

import static org.abx.core.img.SpriteManager.AntiAliasing;


public class SpritesData {
    public static final double fullCircle = 360;
    private double delta;
    private double angleToCounter;
    public ArrayList<SpriteData> sprites;

    public SpritesData(BufferedImage baseline, int rotations) {
        sprites = new ArrayList<>();
        double rotAngle = fullCircle / rotations;
        delta = rotAngle / 2;
        double currAngle = 0;
        for (int i = rotations; i > 0; --i) {
            sprites.add(new SpriteData(rotateImageByDegrees(baseline, currAngle)));
            currAngle += rotAngle;
        }
        angleToCounter = rotAngle;
    }

    public SpriteData get(double angle) {
        angle = ((fullCircle - angle) + delta) % fullCircle;
        angle /= angleToCounter;
        return sprites.get((int) angle);
    }

    private BufferedImage rotateImageByDegrees(BufferedImage img, double angle) {
        double rads = Math.toRadians(angle);
        double sin = Math.abs(Math.sin(rads)), cos = Math.abs(Math.cos(rads));
        int w = img.getWidth();
        int h = img.getHeight();
        int newWidth = (int) Math.floor(w * cos + h * sin);
        int newHeight = (int) Math.floor(h * cos + w * sin);
        BufferedImage rotated = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2d = rotated.createGraphics();
        AffineTransform at = new AffineTransform();
        at.translate((newWidth - w) / 2, (newHeight - h) / 2);
        int x = w / 2;
        int y = h / 2;
        at.rotate(rads, x, y);
        g2d.setTransform(at);
        g2d.drawImage(img, 0, 0, null);
        return resize(rotated);
    }

    public static BufferedImage resize(BufferedImage img) {
        int newW = img.getWidth() / AntiAliasing;
        int newH = img.getHeight() / AntiAliasing;
        int w = img.getWidth();
        int h = img.getHeight();
        BufferedImage smaller = new BufferedImage(newW, newH, img.getType());
        Graphics2D g = smaller.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION,
                RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g.drawImage(img, 0, 0, newW, newH, 0, 0, w, h, null);
        g.dispose();
        return smaller;
    }
}
