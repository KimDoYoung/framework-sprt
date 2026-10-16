package kr.co.kfs.asseterp.biz.sys.dto;

/** Sys15_Edit_Corp 저장 한 행 (corpId ≤ 0·null이면 새 행). 회사는 로그인 회사로 서버가 정한다 */
public record CorpSaveReq(Long corpId, String corpType, String corpName, String bizNo, String corpCode, Long seq,
                          String useYn, String note, String tel, String addr, String issCorpCode) {
    public CorpSaveReq withBizNoAndCode(String newBizNo, String newCorpCode) {
        return new CorpSaveReq(corpId, corpType, corpName, newBizNo, newCorpCode, seq, useYn, note, tel, addr, issCorpCode);
    }

    public CorpSaveReq withId(Long id) {
        return new CorpSaveReq(id, corpType, corpName, bizNo, corpCode, seq, useYn, note, tel, addr, issCorpCode);
    }
}
