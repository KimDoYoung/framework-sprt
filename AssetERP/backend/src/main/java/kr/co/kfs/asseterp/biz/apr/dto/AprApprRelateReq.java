package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;
import java.util.List;

/**
 * [저장]·[결재요청]에 함께 보내는 연관 탭 다섯 개의 화면 내용 전체 (AS-IS Apr03_Page_Relate.getRelateFundList·AdvList·ApprList·IcsList·IcrList → Apr01_Appr.update, V13).
 * 각 목록은 null이면 그 탭은 건드리지 않고, 빈 목록이면 모두 지운다.
 */
public record AprApprRelateReq(List<Fund> funds, List<Adv> advs, List<Appr> apprs, List<Law> ics, List<Law> icr) {

    /** apr03_relate_fund — relateFundId가 null이면 새 줄 */
    public record Fund(Long relateFundId, Long fundId, String printYn, String afterYn) {
    }

    /** apr12_relate_adv */
    public record Adv(Long relateAdvId, Long advId) {
    }

    /** apr21_relate_appr */
    public record Appr(Long relateApprId, Long targetApprId) {
    }

    /** apr20_relate_ics / apr22_relate_icr — standYn은 마감일을 [계산하기]로 구했는지 */
    public record Law(Long relateId, Long classTreeId, Long deadlineId, String standCode, LocalDate standDate, LocalDate closeDate, String standYn) {
    }
}
