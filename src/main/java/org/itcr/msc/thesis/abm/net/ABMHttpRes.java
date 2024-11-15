package org.itcr.msc.thesis.abm.net;

import java.io.UnsupportedEncodingException;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

public class ABMHttpRes {

    private final HttpResponse<byte[]> response;

    public ABMHttpRes(HttpResponse<byte[]> response) {
        this.response = response;
    }

    public byte[] asByteArray() {
        return response.body();
    }

    public String asString() throws UnsupportedEncodingException {
        return new String(response.body(),"UTF-8");
    }


    public Map<String, List<String>> headers() {
        return response.headers().map();
    }

}
