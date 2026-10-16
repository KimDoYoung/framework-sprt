package kr.co.kfs.asseterp.biz.auth.dto;

/**
 * 인증 서비스 처리 결과. 토큰은 컨트롤러에서 쿠키로만 내려보내고, 응답 본문에는 loginRes만 사용한다.
 */
public record AuthResult(
        LoginRes loginRes,
        String accessToken,
        String refreshToken
) {
}
