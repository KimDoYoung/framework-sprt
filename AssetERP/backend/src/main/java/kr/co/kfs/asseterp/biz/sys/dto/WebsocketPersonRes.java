package kr.co.kfs.asseterp.biz.sys.dto;

/** 접속 중인 사원 한 행 (AS-IS Emp01_PersonModel 중 화면 열). officeTelno·mobileTelno는 원본 모델 속성 officeTelNo·mobileTelNo */
public record WebsocketPersonRes(Long personId, String companyName, String korName, String empNo, String posName, String officeTelno, String mobileTelno) {
}
