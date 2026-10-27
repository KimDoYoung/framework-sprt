package kr.co.kfs.asseterp.biz.est.dto;

/** 로그인 사용자의 승인자(조직장) (AS-IS est03_pf_history.getConfirmerParent). 승인자가 없으면 둘 다 null */
public record PfConfirmerRes(Long confirmerId, String confirmerName) {
}
