package kr.co.kfs.asseterp.biz.rd.dto;

import java.util.Map;

/**
 * RD 호출 주소 요청. kind: viewer(미리보기 iframe) / download(브라우저 내려받기) / save(서버 저장).
 * rv는 mrd에 넘길 파라미터이며 companyId·personId는 보내도 서버가 로그인 값으로 덮어쓴다. fileName은 확장자를 뺀 이름이 아니라 "이름.확장자"(save는 저장 폴더 아래 상대 이름)
 */
public record RdUrlReq(
        String kind,
        String mrd,
        String options,
        String exportType,
        String fileName,
        Map<String, String> rv
) {
}
