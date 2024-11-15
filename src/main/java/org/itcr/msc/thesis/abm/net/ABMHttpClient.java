package org.itcr.msc.thesis.abm.net;

import java.net.http.HttpClient;
import java.net.http.HttpResponse;
import java.time.Duration;

public class ABMHttpClient {

    private HttpClient client;

    public ABMHttpClient() {
        client = HttpClient.newBuilder().
                connectTimeout(Duration.ofSeconds(20)).
                build();
    }

    public ABMHttpRes process(ABMHttpReq req) throws Exception {
        HttpResponse<byte[]> res = client.send(req.compile(), HttpResponse.BodyHandlers.ofByteArray());
        return new ABMHttpRes(res);
    }

    public ABMHttpRes get(String uri) throws Exception {
        return process(new ABMHttpReq("GET", uri));
    }

    public ABMHttpReq createGet(String uri) throws Exception {
        return new ABMHttpReq("GET", uri);
    }


    public ABMHttpReq createDelete(String uri) throws Exception {
        return new ABMHttpReq("DELETE", uri);
    }

    public ABMHttpReq createPost(String uri) throws Exception {
        return new ABMHttpReq("POST", uri);
    }

    public ABMHttpReq createPut(String uri) throws Exception {
        return new ABMHttpReq("PUT", uri);
    }

    public ABMHttpReq createPatch(String uri) throws Exception {
        return new ABMHttpReq("PATCH", uri);
    }
}
