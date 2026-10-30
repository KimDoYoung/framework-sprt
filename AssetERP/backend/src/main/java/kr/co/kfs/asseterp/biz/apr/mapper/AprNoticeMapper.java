package kr.co.kfs.asseterp.biz.apr.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.kfs.asseterp.biz.apr.dto.AprNoticePerson;
import kr.co.kfs.asseterp.biz.apr.dto.AprNoticeStep;

/** 결재 알림 대상 조회 (AS-IS server/apr/Apr04_ApprStep.confirmUpdate·clearApprStepId의 알림 부분, AA01) */
@Mapper
public interface AprNoticeMapper {

    /** AS-IS emp01_person.selectById */
    AprNoticePerson selectPerson(@Param("personId") Long personId);

    /** AS-IS sys01_company.selectById 중 위치명(sys01_loc_nm) */
    String selectCompanyLoc(@Param("companyId") Long companyId);

    /** AS-IS dcr01_class_tree.selectById 중 분류명 */
    String selectClassTreeName(@Param("classTreeId") Long classTreeId);

    /** AS-IS emp92_sms_notice.sendCheckTalk — 앱알림을 끈 행 수(0이어야 보낸다) */
    int countTalkBlocked(@Param("personId") Long personId, @Param("noticeCode") String noticeCode);

    /** AS-IS emp92_sms_notice.sendCheckMail */
    int countMailBlocked(@Param("personId") Long personId, @Param("noticeCode") String noticeCode);

    /** AS-IS emp92_sms_notice.sendCheckSms */
    int countSmsBlocked(@Param("personId") Long personId, @Param("noticeCode") String noticeCode);

    /** AS-IS apr04_appr_step.selectByApprId 중 알림에 쓰는 열 (정렬 f_to_number(seq), 단계코드, ID) */
    List<AprNoticeStep> selectSteps(@Param("apprId") Long apprId);

    /** AS-IS apr04_appr_step.lastCheck — 결재·합의한 단계, 최근 순 */
    List<AprNoticeStep> selectLastCheck(@Param("apprId") Long apprId);

    /** AS-IS apr04_appr_step.nextCheck — 아직 대기인 단계, 순서대로 */
    List<AprNoticeStep> selectNextCheck(@Param("apprId") Long apprId);

    /** AS-IS apr04_appr_step.lastStepOne — 마지막 결재 단계(참조·인감 제외)의 결재자 */
    Long selectLastStepEmp(@Param("apprId") Long apprId);

    /** AS-IS apr10_stamp.selectByAlt — 인감 대결자가 지정된 문서면 행이 하나, 값은 인감 (부)책임자 */
    List<Long> selectStampAltSecondEmp(@Param("apprId") Long apprId, @Param("personId") Long personId);
}
