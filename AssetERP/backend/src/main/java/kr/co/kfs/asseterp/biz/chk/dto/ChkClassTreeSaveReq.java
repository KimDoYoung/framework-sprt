package kr.co.kfs.asseterp.biz.chk.dto;

/** Chk01_Edit_ClassTree 저장 (AS-IS chk.Chk01_ClassTree.update): 회사는 서버가 로그인 회사로 채운다. 새 분류는 classTreeId 없이 보내면 서버가 채번 */
public record ChkClassTreeSaveReq(Long parentTreeId, String classTreeName, Long seq, String useYn, String note, String linkCode) {
}
