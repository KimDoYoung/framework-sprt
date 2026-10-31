package kr.co.kfs.asseterp.biz.apr.dto;

import java.util.List;

/**
 * 인감을 고른 뒤의 결재선 (AS-IS Apr01_Edit_ApprDoc.retrieveRoleStamp·retrieveStamp·resetApprStep·findStampEmpId, V12)
 * ok가 false면 인감을 쓸 수 없는 경우(message)이고 steps는 인감 줄이 없는 기본 결재선이다.
 * outType은 인감이 있어 대외문서로 바꿔야 하는 경우(retrieveStamp: radioOutType)
 */
public record AprStampLineRes(boolean ok, String message, Long stampId, String stampName, String stampIdString, boolean outType, List<AprNewStepRes> steps) {
}
