package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.PayFormulaDateRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayFormulaRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayFormulaSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/pay/mapper/pay04_formula.xml + UpdateDataModel(pay04_formula) — 임금계산방법 */
@Mapper
public interface PayFormulaMapper {
    /** AS-IS selectByCompanyId: 회사의 기준 적용일 목록(최신순) */
    List<PayFormulaDateRes> selectDates(@Param("companyId") Long companyId);

    /** AS-IS selectByDate: 적용일의 산출식 행(급여항목 조인) */
    List<PayFormulaRes> selectByDate(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate);

    /** AS-IS selectByMaxCompanyId: 오늘 이전 가장 최근 적용일의 행 */
    List<PayFormulaRes> selectByMaxCompanyId(@Param("companyId") Long companyId);

    PayFormulaRes selectById(@Param("formulaId") Long formulaId);

    /** dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    /** AS-IS insert / UpdateDataModel INSERT */
    int insert(@Param("formulaId") Long formulaId, @Param("companyId") Long companyId, @Param("req") PayFormulaSaveReq req);

    int update(@Param("companyId") Long companyId, @Param("req") PayFormulaSaveReq req);

    /** AS-IS deleteByDate */
    int deleteByDate(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate);

    /** UpdateDataModel.deleteModel (ID로 DELETE) — 회사 조건을 더했다(05 §6) */
    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);
}
