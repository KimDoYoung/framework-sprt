package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.AstDetailRes;
import kr.co.kfs.asseterp.biz.ast.dto.AstDetailSaveReq;
import kr.co.kfs.asseterp.biz.ast.dto.AstItemDetailRes;
import kr.co.kfs.asseterp.biz.ast.dto.AstItemDetailSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/ast/mapper/ast02_detail.xml + UpdateDataModel(ast02_detail) — 자산상세 */
@Mapper
public interface AstDetailMapper {
    /** AS-IS selectByCompanyId0 (공통 회사 0 전용) */
    List<AstDetailRes> selectByCompanyId0(@Param("defaultYn") String defaultYn, @Param("companyId") Long companyId,
                                          @Param("searchText") String searchText, @Param("useYn") String useYn);

    AstDetailRes selectById(@Param("detailId") Long detailId);

    /** dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    int insert(@Param("detailId") Long detailId, @Param("companyId") Long companyId, @Param("req") AstDetailSaveReq req);

    int update(@Param("companyId") Long companyId, @Param("req") AstDetailSaveReq req);

    /** UpdateDataModel.deleteModel (ID로 DELETE) */
    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    // ==================== R09 종목상세 (ast02_detail) ====================

    /** AS-IS ast02_detail.selectByClassTreeId */
    List<AstItemDetailRes> selectByClassTreeId(@Param("classTreeId") Long classTreeId, @Param("companyId") Long companyId);

    /** AS-IS ast02_detail.selectByCompanyId */
    List<AstItemDetailRes> selectByCompanyId(@Param("defaultYn") String defaultYn, @Param("companyId") Long companyId,
                                            @Param("searchText") String searchText);

    int insertItemDetail(@Param("detailId") Long detailId, @Param("companyId") Long companyId, @Param("req") AstItemDetailSaveReq req);

    int updateItemDetail(@Param("companyId") Long companyId, @Param("req") AstItemDetailSaveReq req);
}
