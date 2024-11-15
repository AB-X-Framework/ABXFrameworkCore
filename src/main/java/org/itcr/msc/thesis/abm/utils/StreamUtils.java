package org.itcr.msc.thesis.abm.utils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class StreamUtils {

    public static String readResource(String resource) throws IOException {
        return readStream(StreamUtils.class.getClassLoader().getResourceAsStream(resource));
    }


    public static byte[] readByteArrayResource(String resource) throws IOException {
        return readByteArrayStream(StreamUtils.class.getClassLoader().getResourceAsStream(resource));
    }

    public static byte[] readByteArrayStream(InputStream is) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        byte[] data = new byte[1024];
        int size;
        while ((size = is.read(data)) >= 0) {
            baos.write(data,0,size);
        }
        is.close();
        return baos.toByteArray();
    }

    public static String readStream(InputStream is) throws IOException {
        StringBuilder sb = new StringBuilder();
        byte[] data = new byte[1024];

        int size;
        while ((size = is.read(data)) >= 0) {
            sb.append(new String(data, 0, size, "UTF-8"));
        }
        is.close();
        return sb.toString();
    }

}
