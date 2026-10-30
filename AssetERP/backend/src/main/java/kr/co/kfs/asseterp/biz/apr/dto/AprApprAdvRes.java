package kr.co.kfs.asseterp.biz.apr.dto;

/** 연관일임 탭 한 줄 (apr12_relate_adv.selectByApprId 중 Apr03_Page_Relate.buildRelateAdvGrid 열, V01) */
public record AprApprAdvRes(Long relateAdvId, String manageCode, String manageName) {
}
