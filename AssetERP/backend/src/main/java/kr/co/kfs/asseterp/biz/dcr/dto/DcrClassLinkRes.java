package kr.co.kfs.asseterp.biz.dcr.dto;

/** 문서분류에 걸린 Link (AS-IS dcr30_link.selectByClassTreeId 중 화면이 쓰는 값). note가 null이면 기능 설정만 있는 Link */
public record DcrClassLinkRes(Long linkId, String note) {
}
