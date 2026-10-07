package kr.co.kfs.asseterp.biz.push.dto;

/**
 * 클라이언트 → 서버 양방향 통신 확인 (/app/echo)
 */
public record EchoReq(String text) {
}
