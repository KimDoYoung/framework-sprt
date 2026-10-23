package kr.co.kfs.asseterp.biz.rd.dto;

/** RD 호출 주소. method는 viewer=GET(iframe src), download·save=POST(숨은 form action) — AS-IS RDUtil과 같다 */
public record RdUrlRes(
        String url,
        String method
) {
}
