package kr.co.kfs.asseterp.biz.batch.ipo;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Component;

import java.io.IOException;

/** AS-IS `Jsoup.connect(url).get()` 그대로 */
@Component
public class JsoupIpoPageFetcher implements IpoPageFetcher {

    @Override
    public Document fetch(String url) throws IOException {
        return Jsoup.connect(url).get();
    }
}
