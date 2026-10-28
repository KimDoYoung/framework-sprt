package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.PayAnnualRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayAnnualSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/pay/mapper/pay01_annual.xml + UpdateDataModel(pay01_annual) + ExcelUpload.payUpload — 연봉계약관리 */
@Mapper
public interface PayAnnualMapper {
    /** AS-IS selectByAll (personId 없음) */
    List<PayAnnualRes> selectByAll(@Param("companyId") Long companyId, @Param("radioOption") int radioOption,
                                   @Param("yearStr") String yearStr, @Param("retireYn") boolean retireYn,
                                   @Param("apprCheckYn") boolean apprCheckYn);

    /** AS-IS selectByPersonId */
    List<PayAnnualRes> selectByPersonId(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                        @Param("radioOption") int radioOption, @Param("yearStr") String yearStr,
                                        @Param("retireYn") boolean retireYn, @Param("apprCheckYn") boolean apprCheckYn,
                                        @Param("apprYn") boolean apprYn);

    /** AS-IS selectById — 저장·삭제 전 상신상태 확인과 저장 뒤 돌려줄 행(직급은 radioOption 2 = 적용시작일 기준) */
    PayAnnualRes selectById(@Param("annualId") Long annualId, @Param("companyId") Long companyId, @Param("radioOption") int radioOption);

    /** dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    int insert(@Param("annualId") Long annualId, @Param("companyId") Long companyId, @Param("req") PayAnnualSaveReq req);

    int update(@Param("companyId") Long companyId, @Param("req") PayAnnualSaveReq req);

    /** UpdateDataModel.deleteModel (ID로 DELETE) */
    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** TOBE 추가: 저장 대상 사원이 로그인 회사 소속인지 */
    int countPerson(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** emp01_person.selectByEmpNo — 엑셀의 사번으로 사원 ID */
    Long selectPersonIdByEmpNo(@Param("companyId") Long companyId, @Param("empNo") String empNo);

    /** pay01_annual.excelDelete */
    int excelDelete(@Param("companyId") Long companyId, @Param("personId") Long personId,
                    @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);

    /** pay01_annual.excelInsert */
    int excelInsert(@Param("annualId") Long annualId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                    @Param("req") PayAnnualSaveReq req);

    /** AS-IS sys99_print.deleteByPersonId — 내 출력 자료 정리 */
    int deletePrint(@Param("companyId") Long companyId, @Param("printPersonId") Long printPersonId,
                    @Param("windowClassName") String windowClassName);

    /** AS-IS Sys99_Print.insertRdAnnualListAll — 전체 목록(selectByAll)을 출력 자료로 */
    int insertPrintAll(@Param("companyId") Long companyId, @Param("printPersonId") Long printPersonId,
                       @Param("windowClassName") String windowClassName, @Param("groupId") Long groupId,
                       @Param("radioOption") int radioOption, @Param("yearStr") String yearStr,
                       @Param("retireYn") boolean retireYn, @Param("apprCheckYn") boolean apprCheckYn);

    /** AS-IS Sys99_Print.insertRdAnnualList — 고른 사원의 목록(selectByPersonId)을 출력 자료로 */
    int insertPrintPerson(@Param("companyId") Long companyId, @Param("printPersonId") Long printPersonId,
                          @Param("windowClassName") String windowClassName, @Param("groupId") Long groupId,
                          @Param("personId") Long personId, @Param("radioOption") int radioOption, @Param("yearStr") String yearStr,
                          @Param("retireYn") boolean retireYn, @Param("apprCheckYn") boolean apprCheckYn, @Param("apprYn") boolean apprYn);
}
