package kr.co.kfs.asseterp.biz.crd.mapper;

import kr.co.kfs.asseterp.biz.crd.dto.CrdCardManagerRes;
import kr.co.kfs.asseterp.biz.crd.dto.CrdCardRes;
import kr.co.kfs.asseterp.biz.crd.dto.CrdCardSaveReq;
import kr.co.kfs.asseterp.biz.crd.dto.CrdCardUserRes;
import kr.co.kfs.asseterp.biz.crd.dto.CrdCardUserSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/crd/mapper/crd01_card.xml·crd03_trans.xml·crd02_data.xml + UpdateDataModel(crd01_card·crd03_trans) — 법인카드 및 사용자등록 */
@Mapper
public interface CrdCardMapper {
    /** AS-IS crd01_card.selectByText — searchText는 "%…%"로 감싼 값, useYn true면 사용카드만, managerId 없으면 전체 */
    List<CrdCardRes> selectByText(@Param("companyId") Long companyId, @Param("searchText") String searchText,
                                  @Param("useYn") boolean useYn, @Param("managerId") Long managerId);

    /** AS-IS crd01_card.selectById (저장 뒤 다시 읽기) */
    CrdCardRes selectById(@Param("companyId") Long companyId, @Param("cardId") Long cardId);

    /** AS-IS sys00_common.selectCardManager */
    List<CrdCardManagerRes> selectManagers(@Param("companyId") Long companyId, @Param("useYn") boolean useYn);

    /** AS-IS crd02_data.selectByCardNo — 그 카드번호(식별구분)로 올린 사용내역 건수 */
    int countDataByCardNo(@Param("companyId") Long companyId, @Param("cardNo") String cardNo);

    /** dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    int insertCard(@Param("cardId") Long cardId, @Param("companyId") Long companyId, @Param("req") CrdCardSaveReq req);

    int updateCard(@Param("companyId") Long companyId, @Param("req") CrdCardSaveReq req);

    /** AS-IS crd03_trans.deleteByCardId */
    int deleteTransByCardId(@Param("cardId") Long cardId);

    /** UpdateDataModel.deleteModel(crd01_card) */
    int deleteCard(@Param("companyId") Long companyId, @Param("cardId") Long cardId);

    /** AS-IS crd01_card.excelInsert — 사용여부 true·카드구분 1·종료일 없음·결제계좌 없음 */
    int excelInsertCard(@Param("cardId") Long cardId, @Param("companyId") Long companyId, @Param("bankCode") String bankCode,
                        @Param("cardName") String cardName, @Param("cardNoSlip") String cardNoSlip, @Param("cardNo") String cardNo,
                        @Param("frDate") LocalDate frDate, @Param("note") String note);

    // ===== Crd03_Grid_User (crd03_trans) =====

    /** AS-IS crd03_trans.selectByCardId */
    List<CrdCardUserRes> selectUsers(@Param("cardId") Long cardId);

    CrdCardUserRes selectUserById(@Param("cardId") Long cardId, @Param("transId") Long transId);

    int insertUser(@Param("transId") Long transId, @Param("cardId") Long cardId, @Param("req") CrdCardUserSaveReq req);

    int updateUser(@Param("cardId") Long cardId, @Param("req") CrdCardUserSaveReq req);

    /** UpdateDataModel.deleteModel(crd03_trans) — 이 카드의 행만 */
    int deleteUsers(@Param("cardId") Long cardId, @Param("ids") List<Long> ids);
}
