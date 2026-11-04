package kr.co.kfs.asseterp.biz.sys.dto;

/** 기기 등록 요청 (AS-IS Sys27_Lookup_Request): 접속장소(LoginPlaceCode)·사유·기기 Mac(브라우저는 알 수 없어 비어도 된다) */
public record LoginManageRequestReq(String placeCode, String reason, String macAddress) {
}
