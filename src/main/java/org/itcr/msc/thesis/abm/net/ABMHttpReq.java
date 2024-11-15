package org.itcr.msc.thesis.abm.net;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class ABMHttpReq {

    private MultiPartBodyPublisher mbp;
    private final String method;
    private final String uri;
    private final HashMap<String, ArrayList<String>> headers;

    public ABMHttpReq(String method, String uri) {
        this.method = method;
        this.uri = uri;
        this.headers = new HashMap<>();
    }

    public ABMHttpReq addHeader(String name,String value){
        if (!headers.containsKey(name)){
            headers.put(name, new ArrayList<>());
        }
        headers.get(name).add(value);
        return this;
    }

    public ABMHttpReq addPart(String name, String value) {
        if (mbp == null) {
            mbp = new MultiPartBodyPublisher();
        }
        mbp.addPart(name, value);
        return this;
    }

    public ABMHttpReq addFile(String name, String value) {
        if (mbp == null) {
            mbp = new MultiPartBodyPublisher();
        }
        mbp.addFile(name, value);
        return this;
    }

    public ABMHttpReq addStream(String name, InputStream value, String filename, String contentType) {
        if (mbp == null) {
            mbp = new MultiPartBodyPublisher();
        }
        mbp.addStream(name, value, filename, contentType);
        return this;
    }

    public ABMHttpReq addBytes(String name, byte[] value, String filename, String contentType) {
        if (mbp == null) {
            mbp = new MultiPartBodyPublisher();
        }
        mbp.addStream(name, new ByteArrayInputStream(value), filename, contentType);
        return this;
    }

    public HttpRequest compile() throws URISyntaxException {
        HttpRequest.Builder builder;
        switch (method) {
            case "GET": {
                builder = HttpRequest.newBuilder().GET();
                break;
            }
            case "DELETE": {
                builder = HttpRequest.newBuilder().DELETE();
                break;
            }
            case "POST": {
                builder = HttpRequest.newBuilder().POST(mbp.build()).setHeader("Content-Type",
                        "multipart/form-data; boundary=" + mbp.getBoundary());
                break;
            }
            case "PUT": {
                builder = HttpRequest.newBuilder().PUT(mbp.build()).setHeader("Content-Type",
                        "multipart/form-data; boundary=" + mbp.getBoundary());
                break;
            }
            case "PATCH": {
                builder = HttpRequest.newBuilder().method("PATCH", mbp.build()).setHeader("Content-Type",
                        "multipart/form-data; boundary=" + mbp.getBoundary());
                break;
            }
            default:
                throw new IllegalArgumentException("Unsupported HTTP method: " + method);
        }
        for (Map.Entry<String, ArrayList<String>> header : headers.entrySet()) {
            for (String value: header.getValue()) {
                builder.header(header.getKey(),value);
            }
        }
        return builder.uri(new URI(uri)).build();
    }

}
