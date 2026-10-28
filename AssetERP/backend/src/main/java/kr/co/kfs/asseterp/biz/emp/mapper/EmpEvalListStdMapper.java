package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.EvalListStdRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/emp/mapper/emp40_eval_list_std.xml + emp43_eval_target.xml(getEventChk·getEventChk2·getDateChk) — 인사평가 항목리스트 적용기준 */
@Mapper
public interface EmpEvalListStdMapper {
    /** AS-IS emp40_eval_list_std.selectByCompanyId */
    List<EvalListStdRes> selectByCompanyId(@Param("companyId") Long companyId);

    /** AS-IS emp40_eval_list_std.selectByStartDate (건수만 쓴다) */
    int countByStartDate(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate);

    /** 로그인 회사의 적용기준인지 (원본 SQL에는 없는 회사 조건) */
    int countByIdAndCompany(@Param("evalListStdId") Long evalListStdId, @Param("companyId") Long companyId);

    /** dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    /** AS-IS emp40_eval_list_std.insert (확정 = false) */
    int insert(@Param("evalListStdId") Long evalListStdId, @Param("companyId") Long companyId, @Param("startDate") LocalDate startDate);

    /** AS-IS emp40_eval_list_std.updateFixYn */
    int updateFixYn(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate, @Param("fixYn") String fixYn);

    /** AS-IS emp40_eval_list_std.deleteByEvalListStdId (회사 조건을 더했다) */
    int deleteByEvalListStdId(@Param("companyId") Long companyId, @Param("evalListStdId") Long evalListStdId);

    /** AS-IS emp43_eval_target.getEventChk (건수만 쓴다) */
    int countEventChk(@Param("evalListStdId") Long evalListStdId);

    /** AS-IS emp43_eval_target.getEventChk2 */
    int countEventChk2(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate);

    /** AS-IS emp43_eval_target.getDateChk (건수만 쓴다) */
    int countDateChk(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate);

    /** AS-IS emp40_eval_list_std.getEvalListStdId — 그 날짜 이전에 시작한 확정된 적용기준 중 가장 최근 것의 ID (없으면 null) */
    Long selectAppliedId(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate);
}
