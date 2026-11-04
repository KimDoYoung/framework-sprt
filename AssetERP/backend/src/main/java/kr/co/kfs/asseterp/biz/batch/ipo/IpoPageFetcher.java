package kr.co.kfs.asseterp.biz.batch.ipo;

import org.jsoup.nodes.Document;

import java.io.IOException;

/** IPOStock 페이지 한 장을 가져온다. 운영은 jsoup HTTP, 시험은 저장한 HTML 샘플 */
public interface IpoPageFetcher {

    Document fetch(String url) throws IOException;
}
