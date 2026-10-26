package kr.co.kfs.asseterp.biz.fnd.mapper;

import kr.co.kfs.asseterp.biz.fnd.dto.OprFundRes;
import kr.co.kfs.asseterp.biz.fnd.dto.OprFundSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/fnd/mapper/fnd31_opr_fund.xml + ExcelUpload.demandOprFundUpload가 부르는 fnd01_fund_code·adv02_account 조회 */
@Mapper
public interface FndOprFundMapper {
    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS selectByOprId */
    List<OprFundRes> selectByOprId(@Param("oprId") Long oprId);

    OprFundRes selectById(@Param("oprFundId") Long oprFundId);

    /** AS-IS UpdateDataModel 동적 INSERT */
    int insertOprFund(@Param("id") Long oprFundId, @Param("r") OprFundSaveReq req);

    /** AS-IS UpdateDataModel 동적 UPDATE — 화면이 바꾸는 열만 */
    int updateOprFund(@Param("r") OprFundSaveReq req);

    /** AS-IS UpdateDataModel.deleteModel — 그 수요예측의 행만 */
    int deleteOprFunds(@Param("oprId") Long oprId, @Param("oprFundIds") List<Long> oprFundIds);

    /** AS-IS fnd01_fund_code.selectByFundCode — 첫 행의 ID, 없으면 null */
    Long selectFundIdByCode(@Param("companyId") Long companyId, @Param("fundCode") String fundCode);

    /** AS-IS adv02_account.selectByManageCode — 첫 행의 ID, 없으면 null */
    Long selectAccountIdByManageCode(@Param("companyId") Long companyId, @Param("manageCode") String manageCode);

    /** AS-IS fnd31_opr_fund.excelInsert */
    int excelInsert(@Param("id") Long oprFundId, @Param("oprId") Long oprId, @Param("fundId") Long fundId,
                    @Param("qty") Long qty, @Param("settleAmt") Long settleAmt, @Param("fundAdviceType") String fundAdviceType);

    /** AS-IS fnd31_opr_fund.sumQty — exceptFundId 행은 뺀다, 행이 없으면 null */
    Long sumQty(@Param("oprId") Long oprId, @Param("exceptFundId") Long exceptFundId);

    /** AS-IS 공모주청약 펀드배분 업로드의 fnd31_opr_fund.excelInsert */
    int excelInsertSub(@Param("id") Long oprFundId, @Param("oprId") Long oprId, @Param("fundId") Long fundId, @Param("price") Long price,
                       @Param("qty") Long qty, @Param("contAmt") Long contAmt, @Param("fee") Long fee, @Param("settleAmt") Long settleAmt,
                       @Param("fundAdviceType") String fundAdviceType);
}
