package kr.co.kfs.asseterp.biz.crd.mapper;

import kr.co.kfs.asseterp.biz.crd.dto.CrdCardManagerRow;
import kr.co.kfs.asseterp.biz.crd.dto.CrdDataAmountRes;
import kr.co.kfs.asseterp.biz.crd.dto.CrdDataRes;
import kr.co.kfs.asseterp.biz.crd.dto.CrdExcelCodeRes;
import kr.co.kfs.asseterp.biz.crd.dto.CrdDataSaveReq;
import kr.co.kfs.asseterp.biz.crd.dto.CrdPromoAmtRow;
import kr.co.kfs.asseterp.biz.crd.dto.CrdPromoCountRow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS server/crd/mapper/crd02_data.xml + biz/mapper/biz01_promo.xml(내역확정 부분)·crd01_card.selectCardManager·sys01_company.getTaxType
 * + UpdateDataModel(crd02_data) — 법인카드 내역 업로드 (U14).
 * confirmCode·stateCode·searchText·dataBankCode·dataYm은 AS-IS처럼 LIKE에 그대로 쓰는 값(서버가 "%…%"·"%"로 만들어 준다)
 */
@Mapper
public interface CrdDataMapper {
    /** AS-IS crd02_data.selectByTextPaging */
    List<CrdDataRes> selectPaging(@Param("companyId") Long companyId, @Param("searchText") String searchText,
                                  @Param("dataBankCode") String dataBankCode, @Param("dataYm") String dataYm,
                                  @Param("confirmCode") String confirmCode, @Param("stateCode") String stateCode,
                                  @Param("offset") long offset, @Param("limit") long limit);

    /** AS-IS crd02_data.selectByTextTotal */
    long selectTotal(@Param("companyId") Long companyId, @Param("searchText") String searchText,
                     @Param("dataBankCode") String dataBankCode, @Param("dataYm") String dataYm,
                     @Param("confirmCode") String confirmCode, @Param("stateCode") String stateCode);

    /** AS-IS crd02_data.selectByAmt */
    CrdDataAmountRes selectAmount(@Param("companyId") Long companyId, @Param("searchText") String searchText,
                                  @Param("dataBankCode") String dataBankCode, @Param("dataYm") String dataYm,
                                  @Param("confirmCode") String confirmCode, @Param("stateCode") String stateCode);

    /** AS-IS crd02_data.selectByText — 전체내역확정이 조건에 맞는 전체를 읽는다 */
    List<CrdDataRes> selectByText(@Param("companyId") Long companyId, @Param("searchText") String searchText,
                                  @Param("dataBankCode") String dataBankCode, @Param("dataYm") String dataYm,
                                  @Param("confirmCode") String confirmCode, @Param("stateCode") String stateCode);

    List<CrdDataRes> selectByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** AS-IS crd02_data.selectById (저장 뒤 다시 읽기, 로그인 회사 조건 추가) */
    CrdDataRes selectById(@Param("companyId") Long companyId, @Param("dataId") Long dataId);

    /** AS-IS crd11_excel_code.selectByBankCode — 엑셀업로드의 열 위치 맵핑 (회사 맵핑이 없으면 회사 0의 기본 맵핑) */
    List<CrdExcelCodeRes> selectExcelCodes(@Param("companyId") Long companyId, @Param("bankCode") String bankCode);

    /** dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    /** AS-IS crd02_data.getApprovalNo — 승인번호가 없는 행에 붙이는 syscode001… */
    String selectApprovalNo(@Param("companyId") Long companyId, @Param("dataYm") String dataYm);

    /** AS-IS crd02_data.insert (UpdateDataModel INSERT와 엑셀업로드가 함께 쓴다) */
    int insert(@Param("dataId") Long dataId, @Param("companyId") Long companyId, @Param("req") CrdDataSaveReq req);

    int update(@Param("companyId") Long companyId, @Param("req") CrdDataSaveReq req);

    /** UpdateDataModel.deleteModel(crd02_data) */
    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    // ===== biz.Biz01_Promo (내역확정) =====

    /** targetCheck — 그 달 내역의 확정·마감 수 */
    CrdPromoCountRow countPromoByMonth(@Param("companyId") Long companyId, @Param("dataYm") String dataYm);

    /** targetListCheck — 고른 내역의 확정·마감 수 */
    CrdPromoCountRow countPromoByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** biz01_promo.checkData */
    List<Long> selectPromoIdsByDataId(@Param("companyId") Long companyId, @Param("dataId") Long dataId);

    /** crd01_card.selectCardManager */
    List<CrdCardManagerRow> selectCardManager(@Param("companyId") Long companyId, @Param("cardNo") String cardNo,
                                              @Param("approvalDate") LocalDate approvalDate);

    /** sys01_company.getTaxType */
    String selectTaxType(@Param("companyId") Long companyId);

    /** biz01_promo.insert */
    int insertPromo(@Param("promoId") Long promoId, @Param("companyId") Long companyId, @Param("row") CrdDataRes row,
                    @Param("amount") Long amount, @Param("tax") Long tax, @Param("cardId") Long cardId,
                    @Param("taxType") String taxType, @Param("realPersonId") Long realPersonId);

    /** biz01_promo.update (실사용자는 바꾸지 않는다) */
    int updatePromo(@Param("promoId") Long promoId, @Param("companyId") Long companyId, @Param("row") CrdDataRes row,
                    @Param("amount") Long amount, @Param("tax") Long tax, @Param("cardId") Long cardId,
                    @Param("taxType") String taxType);

    /** biz01_promo.selectByApprovalNo */
    CrdPromoAmtRow selectPromoByApprovalNo(@Param("companyId") Long companyId, @Param("dataYm") String dataYm,
                                           @Param("approvalNo") String approvalNo, @Param("stateName") String stateName);

    /** biz01_promo.deleteApprovalNo */
    int deletePromoByApprovalNo(@Param("companyId") Long companyId, @Param("dataYm") String dataYm,
                                @Param("approvalNo") String approvalNo, @Param("stateName") String stateName);

    /** biz01_promo.partCancelUpdate */
    int partCancelUpdate(@Param("promoId") Long promoId, @Param("provideAmt") Long provideAmt, @Param("tax") Long tax);

    /** biz01_promo.deleteBiz — 내역을 지울 때 그 내역의 이익제공 내역도 지운다 */
    int deletePromoByDataIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);
}
