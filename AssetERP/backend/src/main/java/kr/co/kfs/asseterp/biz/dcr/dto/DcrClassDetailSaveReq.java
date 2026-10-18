package kr.co.kfs.asseterp.biz.dcr.dto;

/** 세부분류 저장. classDetailId가 0 이하면 새 행 */
public record DcrClassDetailSaveReq(Long classDetailId, Long classTreeId, String classDetailName, String keyword, String guide,
                                    Long seq, String linkYn, String useYn) {
}
