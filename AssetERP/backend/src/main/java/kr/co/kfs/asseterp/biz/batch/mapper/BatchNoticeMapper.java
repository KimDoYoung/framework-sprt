package kr.co.kfs.asseterp.biz.batch.mapper;

import kr.co.kfs.asseterp.biz.batch.dto.BatchAlarmRecord;
import kr.co.kfs.asseterp.biz.batch.dto.BatchExpenseRequest;
import kr.co.kfs.asseterp.biz.batch.dto.BatchNoticeCompany;
import kr.co.kfs.asseterp.biz.batch.dto.BatchNoticePerson;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 알림 배치 SQL (AS-IS: sch06_alarm.insertAlarmTarget, sch07_alarm_record.selectByAlarmType·updateInfo, sys01_company.selectByName,
 * flt10_tr.getTotalCount, emp01_person.getSmsNoticeCode·selectById, apr07_alt_appr.getToDay, pay50_expense.getExpenseRequestCount)
 */
@Mapper
public interface BatchNoticeMapper {

    /** 회사의 알람 예정내역(sch07_alarm_record) 생성 — 건수를 돌려준다 */
    int insertAlarmTarget(@Param("companyId") Long companyId);

    /** 아직 안 보낸 알람 이력(알람방식 구분, 알람일시 >= 지금-1일) */
    List<BatchAlarmRecord> selectPendingAlarms(@Param("alarmType") String alarmType);

    /** 보낸 곳(메일 주소 등)과 보낸 시각(f_sysdate())을 남긴다 */
    int updateAlarmSendInfo(@Param("alarmRecordId") Long alarmRecordId, @Param("sendInfo") String sendInfo);

    /** 사용 중인 회사(사용여부가 비어 있으면 사용 중) 전부 — ID 0 회사도 포함 */
    List<BatchNoticeCompany> selectNoticeCompanies();

    /** 회사의 위치명 */
    String selectCompanyLoc(@Param("companyId") Long companyId);

    /** 오늘이 업무일인 회사의 임직원매매 사전신청(상태 10) 건수 — 데모 회사 83211 제외 */
    int countFlt10Pending(@Param("companyId") Long companyId);

    /** 수신 대상(사원별 알림코드)으로 등록된 재직 사원 중 휴대폰 번호가 있는 사람 */
    List<BatchNoticePerson> selectSmsNoticeTargets(@Param("companyId") Long companyId, @Param("noticeCode") String noticeCode);

    /** 오늘 유효한 대결자가 있으면 그 사람의 연락처(첫 건), 없으면 null — empId는 대결을 맡길 사원(apr07_target_emp_id) */
    List<AltAppr> selectTodayAltAppr(@Param("empId") Long empId);

    /** 승인자별 사업비지출 승인요청(상태 10) 건수 */
    List<BatchExpenseRequest> selectExpenseRequests(@Param("companyId") Long companyId);

    /** emp01_person.selectById 중 알림에 쓰는 열 */
    BatchNoticePerson selectPerson(@Param("personId") Long personId);

    /** 대결 정보: 대상 사원 ID와 그 사람의 연락처 */
    record AltAppr(Long targetEmpId, String mobileTelNo, String emailAddress, boolean hasPassword) {
    }
}
