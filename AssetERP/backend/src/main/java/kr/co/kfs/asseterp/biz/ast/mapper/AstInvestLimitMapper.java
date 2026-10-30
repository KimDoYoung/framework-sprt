package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.InvestLimitDateRes;
import kr.co.kfs.asseterp.biz.ast.dto.InvestLimitRes;
import kr.co.kfs.asseterp.biz.ast.dto.InvestLimitSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/ast/mapper/ast41_invest_limit.xml + UpdateDataModel(ast41_invest_limit) — 투자한도/StopLoss */
@Mapper
public interface AstInvestLimitMapper {
    /** selectByCompanyId — 적용일 목록 */
    List<InvestLimitDateRes> selectByCompanyId(@Param("companyId") Long companyId);

    /** selectByDate — 적용일 하나의 자산구분별 행 */
    List<InvestLimitRes> selectByDate(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate);

    /** selectById (저장 뒤 다시 읽기) */
    InvestLimitRes selectById(@Param("companyId") Long companyId, @Param("investLimitId") Long investLimitId);

    /** selectByMaxCompanyId — 오늘 이전 가장 최근 적용일의 행들 */
    List<InvestLimitRes> selectByMaxCompanyId(@Param("companyId") Long companyId);

    /** dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    int insert(@Param("investLimitId") Long investLimitId, @Param("companyId") Long companyId, @Param("req") InvestLimitSaveReq req);

    int update(@Param("companyId") Long companyId, @Param("req") InvestLimitSaveReq req);

    /** deleteByDate */
    int deleteByDate(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate);

    /** UpdateDataModel.deleteModel */
    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);
}
