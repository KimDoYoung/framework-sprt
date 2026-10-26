package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.AstAssetItemRes;
import kr.co.kfs.asseterp.biz.ast.dto.AstItemTreeCond;
import kr.co.kfs.asseterp.biz.ast.dto.AstItemTreeRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AstClassTreeMapper {

    /** AS-IS ast01_class_tree.selectByCompanyId (F07) — 사용 중인 노드를 전위 순서로, 종목(IT)은 내가·내 조직이 담당자인 것만 */
    List<AstItemTreeRes> selectItemTree(@Param("c") AstItemTreeCond cond);

    /** AS-IS ast01_class_tree.selectByAssetType (P10 자산별 펀드 조회) — 기준일에 펀드 운용자산이 있는 종목(IT) */
    List<AstAssetItemRes> selectByAssetType(@Param("companyId") Long companyId, @Param("stdDate") java.time.LocalDate stdDate,
                                            @Param("assetType") String assetType, @Param("searchText") String searchText);
}
