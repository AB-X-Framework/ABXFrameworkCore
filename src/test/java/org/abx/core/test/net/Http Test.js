//MY CODE 23423452352345423
function x(y:String){}

x("hi")

const client = createHttpClient();
let content = client.get("https://www.tec.ac.cr/").asString();
Assertions.assertContainsText(content, "<title>TEC</title>")


let randomId = random(7000);
let req = client.createGet("https://echo.free.beeceptor.com/").addHeader("hello", "world" + randomId);
content = client.process(req).asString();
Assertions.assertContainsText(content, "\"Hello\": \"world" + randomId + "\"")


randomconstId = random(7000);
req = client.createPost("https://echo.free.beeceptor.com/");
const randomString = "MultipartValue" + randomId;
req.addPart("MultipartString", randomString);
const randomString2 = "MultipartValue2" + randomId;
req.addBytes("MultipartData", getBytes(randomString2), "bytes.dat", "multipart/form-data");
req.addStream("MultipartData2",
    streamFile("src/test/java/org/abx/core/test/net/Http Test.js"),
        "Http Test.js", "text/javascript");
content = client.process(req).asString();
Assertions.assertContainsText(content, "MultipartString");
Assertions.assertContainsText(content, randomString);
Assertions.assertContainsText(content, "MultipartData");
Assertions.assertContainsText(content, "MultipartData2");


