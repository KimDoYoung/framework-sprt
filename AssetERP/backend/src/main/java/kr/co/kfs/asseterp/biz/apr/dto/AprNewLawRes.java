package kr.co.kfs.asseterp.biz.apr.dto;

/** 새 문서에 따라오는 연관법규·내규 한 줄 (dcr20_relate_ics·dcr21_relate_icr → apr20/apr22, V06). relateId는 서버가 새로 발급한다 */
public record AprNewLawRes(Long relateId, Long classTreeId, String classTreeName, String classTreeFullName, String content, String submitTo,
                           String relatedLaw, String cycleName, Long deadlineId, String deadlineFullName, String deadlineNote) {
}
