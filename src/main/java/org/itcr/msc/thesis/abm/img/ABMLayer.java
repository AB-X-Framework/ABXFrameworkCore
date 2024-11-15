package org.itcr.msc.thesis.abm.img;

import java.awt.*;
import java.awt.image.BufferedImage;

public class ABMLayer {
    public boolean used;

    public BufferedImage image;

    public Graphics2D getGraphics(){
        used = true;
        return (Graphics2D)image.getGraphics();
    }
}
