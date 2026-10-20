package kr.co.kfs.asseterp.biz.cmp.dto;

/** 공용메일 등록·수정 (AS-IS Cmp10_Edit_Tab_MailBook → modelUpdate). 새 메일만 메일주소·비밀번호를 쓴다, 고칠 때는 비고만 바뀐다. 회사는 서버가 로그인 정보로 채운다 */
public record CmpMailBookSaveReq(String emailAddr, String decPassword, String note) {
}
