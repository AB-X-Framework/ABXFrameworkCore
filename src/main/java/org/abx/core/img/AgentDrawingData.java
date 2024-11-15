package org.abx.core.img;

import java.awt.*;

public class AgentDrawingData {
    private static final Font FONT = new Font("SansSerif", Font.PLAIN, 12);
    public double size;
    public String shape;
    public String layer;
    public Color color;
    public double angle;
    public String label;
    public Font font;

    public AgentDrawingData(String layer, String shape, double size, double angle, Color color) {
        this.shape = shape;
        this.layer = layer;
        this.size = size;
        this.color = color;
        this.angle = angle;
        this.font = FONT;
    }

    public void setFontSize(int size){
        this.font = new Font(this.font.getFontName(), Font.PLAIN, size);
    }

    public void setFontName(String name){
        this.font = new Font(name, Font.PLAIN, this.font.getSize());
    }

    public void setFontStyle(String style){
        int st;
        if (style.equals("bold")){
            st = Font.BOLD;
        } else if (style.equals("italic")){
            st = Font.ITALIC;
        } else if (style.equals("plain")){
            st = Font.PLAIN;
        }else {
            throw new RuntimeException("Unknown style: " + style);
        }
        this.font = new Font(font.getFontName(), st, this.font.getSize());
    }
}
