package kr.co.kfs.asseterp.biz.emp.dto;

import java.util.List;

/** Y01 편집창 시작값: 콤보 두 개 + 새 행의 비상망 기본값(AS-IS LoginUser.getUserModel().getEmpPersonModel().getMobileTelNo()) */
public record MyLeaveCodesRes(List<LeaveCodeRes> leaveCodes, List<LeaveCodeRes> spcLeaveCodes, String mobileTelNo) {
}
