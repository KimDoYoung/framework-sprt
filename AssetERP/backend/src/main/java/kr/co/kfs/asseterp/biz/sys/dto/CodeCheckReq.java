package kr.co.kfs.asseterp.biz.sys.dto;

import java.util.List;

/** 코드 변경 전 검사 (AS-IS Sys09_Code.checkCode L317): 코드가 바뀐 행(codeId ≤ 0이면 신규)의 사용중·중복 검사 */
public record CodeCheckReq(String codeKind, List<Row> rows) {
    public record Row(Long codeId, String code) {
    }
}
