package org.itcr.msc.thesis.abm.img;

import org.graalvm.collections.Pair;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.awt.image.DataBufferInt;
import java.awt.image.WritableRaster;
import java.util.ArrayList;
import java.util.HashMap;

public class SpriteData {
    private final static int MaxColors = 100;
    public int w;
    public int h;
    public int wHalf;
    public int hHalf;
    private BufferedImage sprite;
    private Cache<Color, BufferedImage> byColor;

    public SpriteData(BufferedImage sprite) {
        this.sprite = sprite;
        byColor=new Cache<>(MaxColors);
        byColor.put(Color.white,sprite);
        w = sprite.getWidth();
        h = sprite.getHeight();
        wHalf = w / 2;
        hHalf = h / 2;
    }

    public BufferedImage get(Color color) {
        if (!byColor.containsKey(color)) {
            byColor.put(color, getByColor(color));
        }
        return byColor.get(color);
    }

    private BufferedImage getByColor(Color color) {
        BufferedImage dest = new BufferedImage(w, h, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2d=(Graphics2D)dest.getGraphics();
        g2d.setColor(color);
        g2d.setBackground(color);
        g2d.fillRect(0,0,w,h);
        WritableRaster origin = sprite.getRaster();
        WritableRaster target = dest.getRaster();
        for (int i = w-1;i >= 0;i--) {
            for (int j = h-1;j >= 0;j--) {
                int[] pixel=new int[4];
                origin.getPixel(i, j, pixel);
                pixel[0]=color.getRed();
                pixel[1]=color.getGreen();
                pixel[2]=color.getBlue();
                target.setPixel(i,j,pixel);
            }
        }
        return dest;
    }


}
