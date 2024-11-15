package org.abx.core.test.img;

import org.itcr.msc.thesis.abm.img.ImgClient;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import javax.imageio.ImageIO;
import java.awt.*;
import java.io.File;

public class ImgTest {
    @Test
    void imgTest() throws Exception {
        ImgClient client = new ImgClient();
        client.setLayers("[\"Baseline\"]");
        client.newImg(1, 200, 200);
        Graphics2D graphics2D = client.patches();
        graphics2D.setBackground(Color.black);
        graphics2D.setColor(Color.white);
        graphics2D.fillRect(10, 10, 20, 20);
        File f = new File("test.png");
        ImageIO.write(client.getImg(), "png", f);
        Assertions.assertTrue(f.isFile());
        f.delete();
    }
}
