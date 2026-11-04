package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.DeductRow;
import kr.co.kfs.asseterp.biz.emp.dto.OrgEmpManagerRes;
import kr.co.kfs.asseterp.biz.emp.dto.OrgPersonRes;
import kr.co.kfs.asseterp.biz.emp.dto.PersonRow;
import kr.co.kfs.asseterp.biz.emp.dto.TransInfoRes;
import kr.co.kfs.asseterp.biz.emp.dto.TransInfoSearchParam;
import kr.co.kfs.asseterp.biz.emp.dto.TransRow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/emp/mapper/emp00_trans_info.xml + 신규사원 등록(Emp00_TransInfo.update)이 쓰는 SQL */
@Mapper
public interface EmpTransInfoMapper {
    /** AS-IS selectByText */
    List<TransInfoRes> searchTransInfos(TransInfoSearchParam param);

    /** AS-IS selectRetireEmpList — 퇴직(900) 발령 사원 (S22) */
    List<TransInfoRes> searchRetireTransInfos(TransInfoSearchParam param);

    /** AS-IS selectById (transId) */
    TransInfoRes selectTransInfo(TransInfoSearchParam param);

    /** AS-IS selectOneByPersonId (transCode '%') */
    TransInfoRes selectCurrentTransInfo(TransInfoSearchParam param);

    /** AS-IS selectByAllOrgCodeId (조직 + 하위 조직의 사원) */
    List<OrgPersonRes> selectOrgPersons(@Param("companyId") Long companyId, @Param("orgCodeId") Long orgCodeId,
                                        @Param("baseDate") LocalDate baseDate);

    /** AS-IS selectByAllOrgCodeId — 관리자용(Emp00_Tab_OrgEmpManager) 열 */
    List<OrgEmpManagerRes> selectOrgEmpManagers(@Param("companyId") Long companyId, @Param("orgCodeId") Long orgCodeId,
                                                @Param("baseDate") LocalDate baseDate);

    /** AS-IS getSeq (= f_create_seq) */
    Long selectNextId();

    int countEmpNo(@Param("companyId") Long companyId, @Param("empNo") String empNo);

    /** AS-IS emp02_others.insert */
    int insertOthers(@Param("personId") Long personId);

    /** AS-IS UpdateDataModel(emp01_person) INSERT */
    int insertPerson(PersonRow row);

    /** AS-IS UpdateDataModel(emp03_trans) INSERT */
    int insertTrans(TransRow row);

    /** AS-IS emp35_deduct.insert */
    int insertDeduct(DeductRow row);

    /** AS-IS sys09_code.selectByCodeName(0, 'AddDeductType', 입사일) */
    List<String> selectAddDeductTypes(@Param("startDate") LocalDate startDate);

    /** AS-IS emp36_add_deduct.insert */
    int insertAddDeduct(@Param("deductId") Long deductId, @Param("type") String type);

    /** AS-IS sys09_code.selectByCode2 (SEU03 엑셀업로드): 적용일 기준 유효한 코드 하나 — 없으면 null. 코드 값만 쓴다 */
    String selectCodeByCode2(@Param("companyId") Long companyId, @Param("kindCode") String kindCode,
                             @Param("applyDate") LocalDate applyDate, @Param("code") String code);

    /** AS-IS org00_org_info.selectByOrgCode (SEU03): 조직코드 → 조직ID(첫 이력 기준), 없으면 null */
    Long selectOrgCodeIdByOrgCode(@Param("companyId") Long companyId, @Param("orgCode") String orgCode);

    /** AS-IS emp00_trans_info.getOnlineList — 접속 중인 사원(personIds) 목록 (EE51 Emp00_Lookup_SendMessage). personId·transId는 emp00With 조건이라 null로 넘긴다 */
    List<TransInfoRes> selectOnlineList(@Param("companyId") Long companyId, @Param("transDate") String transDate,
                                        @Param("searchText") String searchText, @Param("personIds") List<Long> personIds,
                                        @Param("personId") Long personId, @Param("transId") Long transId);

    /** AS-IS sys99_print.deleteByPersonId (내 출력 자료 정리) */
    int deletePrint(@Param("companyId") Long companyId, @Param("printPersonId") Long printPersonId,
                    @Param("windowClassName") String windowClassName);

    /** AS-IS sys99_print.insert — 인사기록카드는 long01(사원ID)만 채운다 */
    int insertPrint(@Param("companyId") Long companyId, @Param("printPersonId") Long printPersonId,
                    @Param("windowClassName") String windowClassName, @Param("groupId") Long groupId,
                    @Param("empPersonId") Long empPersonId);
}
