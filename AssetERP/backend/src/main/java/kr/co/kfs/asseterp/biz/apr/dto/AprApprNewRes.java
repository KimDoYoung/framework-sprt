package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;
import java.util.List;

/**
 * 새 문서 열기 (Apr01_Edit_ApprDoc.insertApproval: 문서 번호·기본값·결재선·연관법규/내규, V06).
 * 인감(sealCode로 정해지는 기본 인감 retrieveRoleStamp)은 V05에서 인감 조회와 함께 연결한다.
 */
public record AprApprNewRes(Long apprId, Long classTreeId, String classTreeFullName, String printFundYn, String sealCode, String title, String content,
                            LocalDate regDate, String signCompany, String signCeo, String statusCode, Long regEmpId, String regEmpName,
                            List<AprNewStepRes> steps, List<AprNewLawRes> relateIcs, List<AprNewLawRes> relateIcr) {
}
