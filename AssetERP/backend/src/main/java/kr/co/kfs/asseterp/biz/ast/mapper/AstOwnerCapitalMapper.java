package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.OwnerCapitalRes;
import kr.co.kfs.asseterp.biz.ast.dto.OwnerCapitalSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/ast/mapper/ast40_owner_capital.xml + UpdateDataModel(ast40_owner_capital) — 자기자본 */
@Mapper
public interface AstOwnerCapitalMapper {
    /** selectByDate */
    List<OwnerCapitalRes> selectByDate(@Param("companyId") Long companyId, @Param("stdYear") String stdYear);

    /** selectById (저장 뒤 다시 읽기) */
    OwnerCapitalRes selectById(@Param("companyId") Long companyId, @Param("ownerCapitalId") Long ownerCapitalId);

    /** dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    int insert(@Param("ownerCapitalId") Long ownerCapitalId, @Param("companyId") Long companyId, @Param("req") OwnerCapitalSaveReq req);

    int update(@Param("companyId") Long companyId, @Param("req") OwnerCapitalSaveReq req);

    /** UpdateDataModel.deleteModel */
    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);
}
