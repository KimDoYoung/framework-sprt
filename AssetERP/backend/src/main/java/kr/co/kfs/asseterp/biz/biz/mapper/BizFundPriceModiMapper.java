package kr.co.kfs.asseterp.biz.biz.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

import kr.co.kfs.asseterp.biz.apr.dto.AprLinkRelateApprRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizFundPriceModiLinkRow;
import kr.co.kfs.asseterp.biz.biz.dto.FundPriceModiMonthRes;
import kr.co.kfs.asseterp.biz.biz.dto.FundPriceModiRes;
import kr.co.kfs.asseterp.biz.biz.dto.FundPriceModiSaveReq;

@Mapper
public interface BizFundPriceModiMapper {

    /** AS-IS biz60_fund_price_modi.selectById — 결재창 A75~A77 본문용. 회사 조건 추가(원본은 ID만) */
    BizFundPriceModiLinkRow selectLinkById(@Param("companyId") Long companyId, @Param("fundPriceModiId") Long fundPriceModiId);

    /** AS-IS biz60_fund_price_modi.selectByText (A32 Biz60_Tab_FundPriceModiReport) — yyyymm은 `yyyy.mm`, searchText는 `%…%` */
    List<FundPriceModiRes> selectByText(@Param("companyId") Long companyId, @Param("yyyymm") String yyyymm, @Param("searchText") String searchText);

    /** AS-IS biz60_fund_price_modi.selectById (저장 뒤 다시 읽기) — 회사 조건 추가 */
    FundPriceModiRes selectById(@Param("companyId") Long companyId, @Param("fundPriceModiId") Long fundPriceModiId);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    int countById(@Param("companyId") Long companyId, @Param("fundPriceModiId") Long fundPriceModiId);

    /** AS-IS Biz60_FundPriceModi.modelUpdate (UpdateDataModel INSERT) — 등록(변경)자·일시는 자동 */
    int insert(@Param("companyId") Long companyId, @Param("updName") String updName, @Param("r") FundPriceModiSaveReq r);

    int update(@Param("companyId") Long companyId, @Param("updName") String updName, @Param("r") FundPriceModiSaveReq r);

    /** AS-IS Biz60_FundPriceModi.delete (UpdateDataModel DELETE) — 회사 조건 추가 */
    int delete(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** AS-IS Biz60_FundPriceModi.update(apprId) — 상신 뒤 결재문서 ID. 다른 열은 저장된 값 그대로라 한 열만 */
    int updateApprId(@Param("companyId") Long companyId, @Param("fundPriceModiId") Long fundPriceModiId, @Param("apprId") Long apprId);

    /** A77 문서 자동등록 `insertRelateApprIdList`(apr01_appr.getApprIdList) — 고른 보고들의 결재문서(회사 조건, 문서 번호 순) */
    List<AprLinkRelateApprRes> selectRelateApprs(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** AS-IS sys10_file.selectByParentId의 파일 ID (Sys10_File.copyFile이 돌린다 — A75·A76 첨부 복사, V32) */
    List<Long> selectFileIds(@Param("parentId") Long parentId);

    int countApprRelateFile(@Param("fileId") Long fileId, @Param("apprId") Long apprId);

    /** AS-IS sys11_relate_file.insert */
    int insertApprRelateFile(@Param("relateFileId") long relateFileId, @Param("fileId") Long fileId, @Param("apprId") Long apprId);

    /** AS-IS biz61_modi_rpt_relate_appr.selectByCompanyId — 변경년월(`yyyy.mm`)의 월 통합 상신 */
    List<FundPriceModiMonthRes> selectMonth(@Param("companyId") Long companyId, @Param("yyyymm") String yyyymm);

    /** AS-IS biz61_modi_rpt_relate_appr.insert */
    int insertMonth(@Param("companyId") Long companyId, @Param("yyyymm") String yyyymm, @Param("apprId") Long apprId);

    /** AS-IS biz61_modi_rpt_relate_appr.updateApprId */
    int updateMonthApprId(@Param("companyId") Long companyId, @Param("yyyymm") String yyyymm, @Param("apprId") Long apprId);
}
