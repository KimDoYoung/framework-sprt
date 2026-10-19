package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.TrCodeRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrCodeSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/ast/mapper/ast05_tr_code.xml — 거래코드 */
@Mapper
public interface AstTrCodeMapper {
    /** AS-IS selectByCompanyId */
    List<TrCodeRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("searchText") String searchText,
                                      @Param("useYn") String useYn, @Param("assetType") String assetType);

    /** AS-IS selectBySearchText (Ast05_Lookup_TrCode 조회창) */
    List<TrCodeRes> selectBySearchText(@Param("companyId") Long companyId, @Param("searchText") String searchText,
                                       @Param("rcvPayCode") String rcvPayCode, @Param("assetType") String assetType,
                                       @Param("financeYn") String financeYn);

    /** AS-IS selectById */
    TrCodeRes selectById(@Param("trCodeId") Long trCodeId);

    /** AS-IS checkTrCode: 같은 회사·거래코드의 ID */
    Long checkTrCode(@Param("companyId") Long companyId, @Param("trCode") String trCode);

    /** AS-IS dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    /** UpdateDataModel INSERT — 화면 insertRow()가 회사 ID·자산구분 "1"을 넣는다 */
    int insert(@Param("trCodeId") Long trCodeId, @Param("companyId") Long companyId, @Param("req") TrCodeSaveReq req);

    /** UpdateDataModel UPDATE — 회사 조건을 더했다 */
    int update(@Param("companyId") Long companyId, @Param("req") TrCodeSaveReq req);

    /** UpdateDataModel.deleteModel — 회사 조건을 더했다 */
    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** AS-IS deleteByTrCode */
    int deleteByTrCode(@Param("companyId") Long companyId, @Param("trCode") String trCode);

    /** AS-IS insertInitData: 관리자 회사(0)의 그 코드를 대상 회사로 복사 */
    int insertInitData(@Param("companyId") Long companyId, @Param("trCode") String trCode);
}
