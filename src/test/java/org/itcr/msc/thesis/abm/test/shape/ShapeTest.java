package org.itcr.msc.thesis.abm.test.shape;

import org.itcr.msc.thesis.abm.img.SpriteManager;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;

public class ShapeTest {
    @Test
    public void doTest() throws Exception {
        SpriteManager a = new SpriteManager();
        BufferedImage bi = a.getSprite("circle", 90, 15).get(Color.green);
        File f = new File("data.png");
        ImageIO.write(bi, "png", f);
        Assertions.assertTrue(f.isFile());
        bi = a.getSprite("square", 90, 5).get(Color.green);
        f = new File("data.png");
        ImageIO.write(bi, "png", f);
        Assertions.assertTrue(f.isFile());
        f.delete();
    }

}
