package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.FundTransRes;
import kr.co.kfs.asseterp.biz.ast.dto.FundTransSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/ast/mapper/ast33_fund_trans.xml (X28) + ast06_tr 저장·ast05_tr_code·ast30 이관일 이전 보수원장 삭제 */
@Mapper
public interface AstFundTransMapper {

    /** ast33_fund_trans.selectByDate */
    List<FundTransRes> selectByDate(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                                    @Param("fundTransCode") String fundTransCode, @Param("searchText") String searchText);

    /** ast33_fund_trans.selectById */
    FundTransRes selectById(@Param("companyId") Long companyId, @Param("fundTransId") Long fundTransId);

    /** dbConfig.getSeq */
    long selectNextId();

    int insertFundTrans(@Param("id") long id, @Param("companyId") Long companyId, @Param("r") FundTransSaveReq.Item r);

    int updateFundTrans(@Param("companyId") Long companyId, @Param("r") FundTransSaveReq.Item r);

    int deleteFundTrans(@Param("companyId") Long companyId, @Param("fundTransId") Long fundTransId);

    /** ast05_tr_code.selectByTrCode — 자산분류ID만 */
    List<Long> selectTrCodeClassTreeId(@Param("companyId") Long companyId, @Param("trCode") String trCode);

    /** ast06_tr.upsert의 INSERT 쪽 */
    int insertTr(@Param("trId") long trId, @Param("astClassTreeId") Long astClassTreeId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                 @Param("trCode") String trCode, @Param("r") FundTransSaveReq.Item r, @Param("note") String note);

    /** ast06_tr.upsert의 UPDATE 쪽 */
    int updateTr(@Param("trId") long trId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                 @Param("trCode") String trCode, @Param("r") FundTransSaveReq.Item r, @Param("note") String note);

    /** ast30_book_fund_fee.deleteBeforeHoldDate */
    int deleteBookFundFeeBeforeHoldDate(@Param("companyId") Long companyId, @Param("holdDate") LocalDate holdDate,
                                        @Param("corpId") Long corpId, @Param("fundCode") String fundCode);
}
