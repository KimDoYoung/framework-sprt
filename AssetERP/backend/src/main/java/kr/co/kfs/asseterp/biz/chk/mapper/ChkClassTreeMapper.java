package kr.co.kfs.asseterp.biz.chk.mapper;

import kr.co.kfs.asseterp.biz.chk.dto.ChkClassTreeRes;
import kr.co.kfs.asseterp.biz.chk.dto.ChkClassTreeSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ChkClassTreeMapper {

    /** AS-IS chk01_class_tree.selectByParentId — 그 상위 분류의 바로 아래(회사 구분 없음, 원본 그대로). depth는 서비스가 채운다 */
    List<ChkClassTreeRes> selectByParentId(@Param("parentTreeId") Long parentTreeId);

    /** AS-IS chk01_class_tree.selectById — 저장 결과 한 행 */
    ChkClassTreeRes selectById(@Param("classTreeId") Long classTreeId);

    /** AS-IS chk01_class_tree.selectByLinkCode (E07) — LIMIT 1, 회사 조건 없음(원본 그대로). 없으면 null */
    ChkClassTreeRes selectByLinkCode(@Param("linkCode") String linkCode);

    /** AS-IS chk01_class_tree.selectByCompanyId (E07) — 사용 분류만, 회사 0·로그인 회사, 그 상위 분류의 바로 아래. depth는 서비스가 채운다 */
    List<ChkClassTreeRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("parentTreeId") Long parentTreeId);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    long selectNextId();

    /** AS-IS Chk01_ClassTree.update → UpdateDataModel(chk01_class_tree) INSERT */
    int insert(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId, @Param("req") ChkClassTreeSaveReq req);

    /** AS-IS Chk01_ClassTree.update → UpdateDataModel UPDATE — 로그인 회사 행만 */
    int update(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId, @Param("req") ChkClassTreeSaveReq req);

    /** AS-IS Chk01_ClassTree.delete → UpdateDataModel.deleteModel — 로그인 회사 행만 */
    int deleteById(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId);
}
