package kr.co.kfs.asseterp.biz.bmt.mapper;

import kr.co.kfs.asseterp.biz.bmt.dto.BmtBuyRes;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtBuySaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface BmtBuyMapper {

    /** AS-IS bmt01_buy.selectByCompanyId — leftYn이 true면 재고가 0이 아닌 건만 */
    List<BmtBuyRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                      @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                                      @Param("leftYn") boolean leftYn);

    /** AS-IS bmt01_buy.selectById — 저장 뒤 다시 읽기 */
    BmtBuyRes selectById(@Param("companyId") Long companyId, @Param("buyId") Long buyId);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS Bmt01_Buy.update → UpdateDataModel INSERT (등록자·회사는 서버 값) */
    int insert(@Param("buyId") long buyId, @Param("companyId") Long companyId, @Param("regEmpId") Long regEmpId,
               @Param("req") BmtBuySaveReq req);

    /** AS-IS Bmt01_Buy.update → UpdateDataModel UPDATE — 로그인 회사의 행만 */
    int update(@Param("companyId") Long companyId, @Param("buyId") Long buyId, @Param("req") BmtBuySaveReq req);

    /** AS-IS Bmt01_Buy.delete → UpdateDataModel DELETE */
    int deleteByIds(@Param("companyId") Long companyId, @Param("buyIds") List<Long> buyIds);
}
